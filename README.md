# 🔥 75 Day Hard - Glutes & Abs Challenge

A workout app with **REAL cross-device squad sync** powered by PostgreSQL!

## ✨ Features

- **75 days of workouts** - Glutes & abs focused, no equipment needed
- **30-minute sessions** - Timed exercises with automatic rest periods
- **Exercise descriptions** - Clear instructions for every move
- **Progress calendar** - Track completed/missed days
- **REAL Squad Sync** - Friends on different phones can see each other's progress!

---

## 🚀 DEPLOYMENT GUIDE (Railway)

### Step 1: Upload to GitHub

1. **Unzip this folder** to your computer
2. Go to [github.com/new](https://github.com/new) and create a new repo called `75day-app`
3. Open Terminal/Command Prompt in the unzipped folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/75day-app.git
git push -u origin main
```

---

### Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → Login with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `75day-app` repo
4. When asked, choose the **backend** folder

5. **Add PostgreSQL Database:**
   - In your Railway project dashboard, click **+ New**
   - Select **Database** → **Add PostgreSQL**
   - Wait for it to provision (takes ~30 seconds)

6. **Connect Database to Backend:**
   - Click on your **backend** service
   - Go to **Variables** tab
   - Click **Add Variable Reference**
   - Select `DATABASE_URL` from the PostgreSQL options

7. **Get Backend URL:**
   - Click on your **backend** service
   - Go to **Settings** tab → **Networking** section
   - Click **Generate Domain**
   - Copy the URL (looks like: `https://75day-backend-xxxx.up.railway.app`)

---

### Step 3: Deploy Frontend on Railway

1. In your Railway project, click **+ New** → **GitHub Repo**
2. Select the same `75day-app` repo
3. When asked, choose the **frontend** folder

4. **Connect Frontend to Backend:**
   - Click on your **frontend** service
   - Go to **Variables** tab
   - Click **New Variable**
   - Add this variable:
     - **Name:** `VITE_API_URL`
     - **Value:** Your backend URL from Step 2 (the `https://...` URL)

5. **Generate Frontend URL:**
   - Go to **Settings** tab → **Networking**
   - Click **Generate Domain**
   - This is your app's public URL! 🎉

---

### Step 4: Configure the Frontend

**IMPORTANT:** You need to tell the frontend where the backend is!

**Option A - Easy Way (in the app):**
1. Open your frontend URL in a browser
2. Open browser console (F12 → Console tab)
3. Run this command (replace with YOUR backend URL):
```javascript
localStorage.setItem('75day_api_url', 'https://YOUR-BACKEND-URL.up.railway.app');
```
4. Refresh the page

**Option B - Edit the code:**
1. Open `frontend/index.html`
2. Find this line near the top of the `<script>` section:
```javascript
var API_URL = localStorage.getItem('75day_api_url') || '';
```
3. Change it to:
```javascript
var API_URL = 'https://YOUR-BACKEND-URL.up.railway.app';
```
4. Commit and push to GitHub (Railway will auto-redeploy)

---

## 🤝 How Squad Sync Works

| Feature | How It Works |
|---------|--------------|
| Create Squad | Generates unique 6-letter code, saves to database |
| Share Code | Friend enters YOUR code on THEIR phone |
| Join Squad | Links their account to your squad in database |
| Live Sync | App checks database every 5 seconds for updates |
| See Progress | Everyone in squad sees each other's completed days! |

**Example:**
1. You create a squad → Get code `ABC123`
2. Text code to friend: "Join my 75 Day squad: ABC123"
3. Friend opens app → Taps Squad → Taps "Join" tab → Enters `ABC123`
4. Now you both see each other's progress in real-time! 🎉

---

## 📁 Project Structure

```
75day-app/
├── backend/                 # Node.js + Express + PostgreSQL
│   ├── server.js           # API endpoints
│   └── package.json        # Dependencies
│
├── frontend/               # Static HTML/CSS/JS
│   ├── index.html          # Complete app in one file
│   └── package.json        # For Railway deployment
│
└── README.md               # This file
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create or update user |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users/:id/complete` | Mark day as complete |
| DELETE | `/api/users/:id` | Delete user (reset) |
| POST | `/api/squads` | Create new squad |
| POST | `/api/squads/:code/join` | Join existing squad |
| GET | `/api/squads/:code/members` | Get squad members (for sync) |
| POST | `/api/squads/:code/leave` | Leave squad |
| GET | `/api/health` | Health check |

---

## 🐛 Troubleshooting

### "Squad not found" error
- Make sure the code is exactly 6 letters
- The person who created the squad must have backend connected

### Progress not syncing
- Check that both people have the same backend URL configured
- Open browser console to check for API errors
- Make sure backend is running (check Railway dashboard)

### Black screen on load
- Make sure you deployed the `frontend` folder, not the whole repo
- Check browser console for JavaScript errors

---

## 💪 Good luck with your 75 days!

Questions? The [Railway Discord](https://discord.gg/railway) is super helpful!
