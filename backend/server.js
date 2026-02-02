import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        completed_days INTEGER[] DEFAULT '{}',
        squad_code VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS squads (
        code VARCHAR(10) PRIMARY KEY,
        owner_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_squad ON users(squad_code);
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('Database init error:', err.message);
  }
}

initDB();

// ============ USER ROUTES ============

// Create or update user
app.post('/api/users', async (req, res) => {
  try {
    const { id, name, startDate } = req.body;
    
    if (!id || !name || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Upsert user
    const result = await pool.query(`
      INSERT INTO users (id, name, start_date, completed_days)
      VALUES ($1, $2, $3, '{}')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [id, name, startDate]);
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Complete a day
app.post('/api/users/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { day } = req.body;
    const dayNum = parseInt(day);
    
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 75) {
      return res.status(400).json({ error: 'Invalid day number' });
    }
    
    // Add day to completed_days array (only if not already there)
    const result = await pool.query(`
      UPDATE users 
      SET completed_days = (
        SELECT ARRAY(SELECT DISTINCT unnest FROM unnest(array_append(completed_days, $2)) ORDER BY 1)
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `, [id, dayNum]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error completing day:', err.message);
    res.status(500).json({ error: 'Failed to complete day' });
  }
});

// Delete user (reset challenge)
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ============ SQUAD ROUTES ============

// Generate unique squad code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Create squad
app.post('/api/squads', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    // Generate unique code
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await pool.query('SELECT code FROM squads WHERE code = $1', [code]);
      if (existing.rows.length === 0) break;
      code = generateCode();
      attempts++;
    }
    
    // Create squad
    await pool.query(
      'INSERT INTO squads (code, owner_id) VALUES ($1, $2)',
      [code, userId]
    );
    
    // Add user to squad
    await pool.query(
      'UPDATE users SET squad_code = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [code, userId]
    );
    
    res.json({ code });
  } catch (err) {
    console.error('Error creating squad:', err.message);
    res.status(500).json({ error: 'Failed to create squad' });
  }
});

// Join squad
app.post('/api/squads/:code/join', async (req, res) => {
  try {
    const { code } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const upperCode = code.toUpperCase();
    
    // Check if squad exists
    const squad = await pool.query('SELECT * FROM squads WHERE code = $1', [upperCode]);
    
    if (squad.rows.length === 0) {
      return res.status(404).json({ error: 'Squad not found. Check the code and try again.' });
    }
    
    // Add user to squad
    await pool.query(
      'UPDATE users SET squad_code = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [upperCode, userId]
    );
    
    res.json({ success: true, code: upperCode });
  } catch (err) {
    console.error('Error joining squad:', err.message);
    res.status(500).json({ error: 'Failed to join squad' });
  }
});

// Get squad members - THIS IS THE KEY FOR REAL-TIME SYNC
app.get('/api/squads/:code/members', async (req, res) => {
  try {
    const { code } = req.params;
    
    const result = await pool.query(
      'SELECT id, name, start_date, completed_days FROM users WHERE squad_code = $1 ORDER BY name',
      [code.toUpperCase()]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching squad members:', err.message);
    res.status(500).json({ error: 'Failed to fetch squad members' });
  }
});

// Leave squad
app.post('/api/squads/:code/leave', async (req, res) => {
  try {
    const { userId } = req.body;
    
    await pool.query(
      'UPDATE users SET squad_code = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error leaving squad:', err.message);
    res.status(500).json({ error: 'Failed to leave squad' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 75 Day Hard API running on port ${PORT}`);
});
