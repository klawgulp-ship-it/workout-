import React, { useState, useEffect } from 'react';

// API URL - change this after deploying backend to Railway
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API helper
const api = {
  async createUser(id, name, startDate) {
    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, startDate })
    });
    return res.json();
  },
  
  async getUser(id) {
    const res = await fetch(`${API_URL}/api/users/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
  
  async completeDay(userId, day) {
    const res = await fetch(`${API_URL}/api/users/${userId}/complete/${day}`, {
      method: 'PUT'
    });
    return res.json();
  },
  
  async deleteUser(id) {
    await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
  },
  
  async createSquad(userId) {
    const res = await fetch(`${API_URL}/api/squads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },
  
  async joinSquad(code, userId) {
    const res = await fetch(`${API_URL}/api/squads/${code}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error('Squad not found');
    return res.json();
  },
  
  async getSquadMembers(code) {
    const res = await fetch(`${API_URL}/api/squads/${code}/members`);
    return res.json();
  },
  
  async leaveSquad(code, userId) {
    await fetch(`${API_URL}/api/squads/${code}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  }
};

// Workout database
const generateWorkouts = () => {
  const gluteExercises = [
    { name: 'Glute Bridges', duration: 45, rest: 15 },
    { name: 'Single Leg Glute Bridge (L)', duration: 30, rest: 10 },
    { name: 'Single Leg Glute Bridge (R)', duration: 30, rest: 15 },
    { name: 'Donkey Kicks (L)', duration: 40, rest: 10 },
    { name: 'Donkey Kicks (R)', duration: 40, rest: 15 },
    { name: 'Fire Hydrants (L)', duration: 40, rest: 10 },
    { name: 'Fire Hydrants (R)', duration: 40, rest: 15 },
    { name: 'Sumo Squats', duration: 45, rest: 15 },
    { name: 'Pulse Squats', duration: 40, rest: 15 },
    { name: 'Curtsy Lunges', duration: 45, rest: 15 },
    { name: 'Standing Kickbacks (L)', duration: 35, rest: 10 },
    { name: 'Standing Kickbacks (R)', duration: 35, rest: 15 },
    { name: 'Frog Pumps', duration: 45, rest: 15 },
    { name: 'Clamshells (L)', duration: 40, rest: 10 },
    { name: 'Clamshells (R)', duration: 40, rest: 15 },
    { name: 'Rainbow Kicks (L)', duration: 35, rest: 10 },
    { name: 'Rainbow Kicks (R)', duration: 35, rest: 15 },
    { name: 'Squat Pulses', duration: 40, rest: 15 },
    { name: 'Step Back Lunges', duration: 45, rest: 15 },
    { name: 'Wide Stance Squats', duration: 45, rest: 15 },
  ];

  const absExercises = [
    { name: 'Crunches', duration: 45, rest: 15 },
    { name: 'Bicycle Crunches', duration: 45, rest: 15 },
    { name: 'Leg Raises', duration: 40, rest: 15 },
    { name: 'Flutter Kicks', duration: 40, rest: 15 },
    { name: 'Mountain Climbers', duration: 45, rest: 15 },
    { name: 'Plank Hold', duration: 45, rest: 15 },
    { name: 'Side Plank (L)', duration: 30, rest: 10 },
    { name: 'Side Plank (R)', duration: 30, rest: 15 },
    { name: 'Dead Bug', duration: 40, rest: 15 },
    { name: 'Reverse Crunches', duration: 40, rest: 15 },
    { name: 'Toe Touches', duration: 40, rest: 15 },
    { name: 'Russian Twists', duration: 45, rest: 15 },
    { name: 'Heel Taps', duration: 40, rest: 15 },
    { name: 'V-Ups', duration: 35, rest: 15 },
    { name: 'Scissor Kicks', duration: 40, rest: 15 },
    { name: 'Plank to Pike', duration: 40, rest: 15 },
    { name: 'Bird Dog', duration: 40, rest: 15 },
    { name: 'Hollow Body Hold', duration: 35, rest: 15 },
    { name: 'In & Out Abs', duration: 40, rest: 15 },
    { name: 'High Knees', duration: 45, rest: 15 },
  ];

  const workouts = [];
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  for (let day = 1; day <= 75; day++) {
    const weekDay = ((day - 1) % 7) + 1;
    const isRestDay = weekDay === 4 || weekDay === 7;
    
    if (isRestDay) {
      workouts.push({
        day, isRestDay: true, title: 'Active Recovery',
        exercises: [
          { name: 'Light Stretching', duration: 300, rest: 0 },
          { name: 'Deep Breathing', duration: 300, rest: 0 },
          { name: 'Foam Rolling (if available)', duration: 300, rest: 0 },
          { name: 'Gentle Walking', duration: 600, rest: 0 },
          { name: 'Meditation', duration: 300, rest: 0 },
        ]
      });
    } else {
      const focus = day % 3;
      let exercises = [];
      let title = '';
      
      const shuffleWithSeed = (arr, seed) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(seededRandom(seed + i) * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      if (focus === 1) {
        title = 'Glute Burner';
        const shuffledGlutes = shuffleWithSeed(gluteExercises, day * 100);
        const shuffledAbs = shuffleWithSeed(absExercises, day * 200);
        exercises = [...shuffledGlutes.slice(0, 8), ...shuffledAbs.slice(0, 4)];
      } else if (focus === 2) {
        title = 'Core Crusher';
        const shuffledGlutes = shuffleWithSeed(gluteExercises, day * 300);
        const shuffledAbs = shuffleWithSeed(absExercises, day * 400);
        exercises = [...shuffledAbs.slice(0, 8), ...shuffledGlutes.slice(0, 4)];
      } else {
        title = 'Total Tone';
        const shuffledGlutes = shuffleWithSeed(gluteExercises, day * 500);
        const shuffledAbs = shuffleWithSeed(absExercises, day * 600);
        exercises = [];
        for (let i = 0; i < 6; i++) {
          exercises.push(shuffledGlutes[i], shuffledAbs[i]);
        }
      }
      
      const totalTime = 1800;
      const currentTotal = exercises.reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
      const multiplier = totalTime / currentTotal;
      
      exercises = exercises.map(ex => ({
        ...ex,
        duration: Math.round(ex.duration * multiplier),
        rest: Math.round(ex.rest * multiplier)
      }));
      
      workouts.push({ day, isRestDay: false, title, exercises });
    }
  }
  return workouts;
};

const WORKOUTS = generateWorkouts();

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function App() {
  const [page, setPage] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [squadCode, setSquadCode] = useState(null);
  const [squadMembers, setSquadMembers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');

  // Load user on mount
  useEffect(() => {
    const loadData = async () => {
      const savedId = localStorage.getItem('userId');
      const savedSquad = localStorage.getItem('squadCode');
      
      if (savedId) {
        try {
          const user = await api.getUser(savedId);
          if (user) {
            setUserData({
              id: user.id,
              name: user.name,
              startDate: user.start_date,
              completedDays: user.completed_days || []
            });
            setSquadCode(user.squad_code);
            setPage('calendar');
          }
        } catch (e) {
          console.log('Failed to load user');
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Load squad members
  useEffect(() => {
    if (!squadCode) {
      setSquadMembers([]);
      return;
    }
    
    const loadMembers = async () => {
      try {
        const members = await api.getSquadMembers(squadCode);
        setSquadMembers(members.map(m => ({
          id: m.id,
          name: m.name,
          startDate: m.start_date,
          completedDays: m.completed_days || []
        })));
      } catch (e) {
        console.log('Failed to load squad members');
      }
    };
    
    loadMembers();
    const interval = setInterval(loadMembers, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [squadCode, userData]);

  const handleStartChallenge = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!startDate) {
      setError('Please select a start date');
      return;
    }
    
    const id = Date.now().toString();
    
    try {
      const user = await api.createUser(id, userName.trim(), startDate);
      localStorage.setItem('userId', id);
      
      setUserData({
        id: user.id,
        name: user.name,
        startDate: user.start_date,
        completedDays: user.completed_days || []
      });
      setPage('calendar');
      setError('');
    } catch (e) {
      setError('Failed to create account. Try again.');
    }
  };

  const handleCompleteDay = async (day) => {
    try {
      const updated = await api.completeDay(userData.id, day);
      setUserData(prev => ({
        ...prev,
        completedDays: updated.completed_days || []
      }));
    } catch (e) {
      console.log('Failed to save progress');
    }
  };

  const handleCreateSquad = async () => {
    try {
      const { code } = await api.createSquad(userData.id);
      setSquadCode(code);
      localStorage.setItem('squadCode', code);
    } catch (e) {
      setError('Failed to create squad');
    }
  };

  const handleJoinSquad = async () => {
    if (!joinCode.trim()) {
      setError('Please enter a squad code');
      return;
    }
    
    try {
      const { code } = await api.joinSquad(joinCode, userData.id);
      setSquadCode(code);
      localStorage.setItem('squadCode', code);
      setJoinCode('');
      setError('');
    } catch (e) {
      setError('Squad not found');
    }
  };

  const handleLeaveSquad = async () => {
    try {
      await api.leaveSquad(squadCode, userData.id);
      setSquadCode(null);
      setSquadMembers([]);
      localStorage.removeItem('squadCode');
    } catch (e) {
      console.log('Failed to leave squad');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset your challenge? This deletes all progress.')) {
      try {
        await api.deleteUser(userData.id);
      } catch (e) {}
      localStorage.removeItem('userId');
      localStorage.removeItem('squadCode');
      setUserData(null);
      setSquadCode(null);
      setSquadMembers([]);
      setPage('landing');
      setUserName('');
      setStartDate('');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingPulse}><span>🔥</span></div>
        <p style={styles.loadingText}>Loading your challenge...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {page === 'landing' && (
        <LandingPage
          userName={userName} setUserName={setUserName}
          startDate={startDate} setStartDate={setStartDate}
          onStart={handleStartChallenge} error={error}
        />
      )}
      
      {page === 'calendar' && userData && (
        <CalendarPage
          userData={userData}
          squadCode={squadCode}
          onSelectDay={(day) => { setSelectedDay(day); setPage('workout'); }}
          onOpenServer={() => setPage('server')}
          onReset={handleReset}
        />
      )}
      
      {page === 'workout' && selectedDay && (
        <WorkoutPage
          day={selectedDay}
          workout={WORKOUTS[selectedDay - 1]}
          onComplete={() => handleCompleteDay(selectedDay)}
          onBack={() => setPage('calendar')}
          isCompleted={userData.completedDays.includes(selectedDay)}
        />
      )}
      
      {page === 'server' && (
        <ServerPage
          userData={userData}
          squadCode={squadCode}
          squadMembers={squadMembers}
          onCreateSquad={handleCreateSquad}
          onJoinSquad={handleJoinSquad}
          onLeaveSquad={handleLeaveSquad}
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          onBack={() => setPage('calendar')}
          error={error}
        />
      )}
    </div>
  );
}

function LandingPage({ userName, setUserName, startDate, setStartDate, onStart, error }) {
  return (
    <div style={styles.landingContainer}>
      <div style={styles.heroSection}>
        <div style={styles.fireEmoji}>🔥</div>
        <h1 style={styles.heroTitle}>75 DAY</h1>
        <h2 style={styles.heroSubtitle}>HARD</h2>
        <p style={styles.heroTagline}>Glutes & Abs • No Equipment • 30 Min/Day</p>
      </div>
      
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>START YOUR TRANSFORMATION</h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>YOUR NAME</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name" style={styles.textInput} />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>START DATE</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            style={styles.dateInput} />
        </div>
        
        {error && <p style={styles.errorText}>{error}</p>}
        
        <button onClick={onStart} style={styles.startButton}>BEGIN CHALLENGE</button>
        
        <div style={styles.features}>
          <div style={styles.featureItem}><span style={styles.featureIcon}>💪</span><span>Targeted Workouts</span></div>
          <div style={styles.featureItem}><span style={styles.featureIcon}>⏱️</span><span>Built-in Timers</span></div>
          <div style={styles.featureItem}><span style={styles.featureIcon}>👥</span><span>Workout with Friends</span></div>
        </div>
      </div>
    </div>
  );
}

function CalendarPage({ userData, squadCode, onSelectDay, onOpenServer, onReset }) {
  const startDate = new Date(userData.startDate);
  const today = new Date();
  
  const getDayDate = (day) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);
    return date;
  };
  
  const getDayStatus = (day) => {
    const dayDate = getDayDate(day);
    const isCompleted = userData.completedDays.includes(day);
    const isPast = dayDate < new Date(today.toDateString());
    const isToday = dayDate.toDateString() === today.toDateString();
    const isFuture = dayDate > today;
    const isMissed = isPast && !isCompleted;
    return { isCompleted, isPast, isToday, isFuture, isMissed };
  };
  
  const completedCount = userData.completedDays.length;
  const progressPercent = (completedCount / 75) * 100;
  
  const weeks = [];
  for (let i = 0; i < 75; i += 7) {
    weeks.push(Array.from({ length: Math.min(7, 75 - i) }, (_, j) => i + j + 1));
  }

  return (
    <div style={styles.calendarContainer}>
      <div style={styles.calendarHeader}>
        <div>
          <h1 style={styles.calendarTitle}>Hey {userData.name}! 👋</h1>
          <p style={styles.calendarSubtitle}>Day {Math.min(completedCount + 1, 75)} of 75</p>
        </div>
        <button onClick={onOpenServer} style={styles.serverButton}>
          👥 {squadCode ? 'Squad' : 'Join Squad'}
        </button>
      </div>
      
      <div style={styles.progressSection}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
        </div>
        <div style={styles.progressStats}>
          <span>{completedCount} completed</span>
          <span>{75 - completedCount} remaining</span>
        </div>
      </div>
      
      <div style={styles.legendRow}>
        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#00FF88' }} /><span>Done</span></div>
        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#FF6B35' }} /><span>Today</span></div>
        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#FF4757' }} /><span>Missed</span></div>
        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#2D3748' }} /><span>Soon</span></div>
      </div>
      
      <div style={styles.calendarGrid}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={styles.weekRow}>
            <span style={styles.weekLabel}>W{weekIndex + 1}</span>
            {week.map(day => {
              const { isCompleted, isToday, isMissed, isFuture } = getDayStatus(day);
              const workout = WORKOUTS[day - 1];
              
              return (
                <button key={day} onClick={() => onSelectDay(day)}
                  style={{
                    ...styles.dayCell,
                    ...(isCompleted && styles.dayCellCompleted),
                    ...(isToday && styles.dayCellToday),
                    ...(isMissed && styles.dayCellMissed),
                    ...(isFuture && styles.dayCellFuture),
                    ...(workout?.isRestDay && styles.dayCellRest),
                  }}>
                  <span style={styles.dayNumber}>{day}</span>
                  {isCompleted && <span style={styles.checkmark}>✓</span>}
                  {workout?.isRestDay && <span style={styles.restIndicator}>R</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      
      <button onClick={onReset} style={styles.resetButton}>🔄 Reset Challenge</button>
    </div>
  );
}

function WorkoutPage({ day, workout, onComplete, onBack, isCompleted }) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout.exercises[0].duration);
  const [isResting, setIsResting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  
  const exercise = workout.exercises[currentExercise];
  const totalExercises = workout.exercises.length;
  
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      if (isResting) {
        if (currentExercise < totalExercises - 1) {
          setCurrentExercise(c => c + 1);
          setTimeLeft(workout.exercises[currentExercise + 1].duration);
          setIsResting(false);
        } else {
          setWorkoutComplete(true);
          setIsRunning(false);
          if (!isCompleted) onComplete();
        }
      } else {
        if (exercise.rest > 0) {
          setTimeLeft(exercise.rest);
          setIsResting(true);
        } else if (currentExercise < totalExercises - 1) {
          setCurrentExercise(c => c + 1);
          setTimeLeft(workout.exercises[currentExercise + 1].duration);
        } else {
          setWorkoutComplete(true);
          setIsRunning(false);
          if (!isCompleted) onComplete();
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isResting, currentExercise, totalExercises, exercise, workout, isCompleted, onComplete]);
  
  const skipExercise = () => {
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(c => c + 1);
      setTimeLeft(workout.exercises[currentExercise + 1].duration);
      setIsResting(false);
    } else {
      setWorkoutComplete(true);
      setIsRunning(false);
      if (!isCompleted) onComplete();
    }
  };
  
  const restartWorkout = () => {
    setCurrentExercise(0);
    setTimeLeft(workout.exercises[0].duration);
    setIsResting(false);
    setIsRunning(false);
    setWorkoutComplete(false);
  };
  
  const progress = ((currentExercise + (isResting ? 0.5 : 0)) / totalExercises) * 100;
  
  if (workoutComplete) {
    return (
      <div style={styles.workoutContainer}>
        <div style={styles.completeScreen}>
          <div style={styles.confetti}>🎉</div>
          <h1 style={styles.completeTitle}>DAY {day} COMPLETE!</h1>
          <p style={styles.completeSubtitle}>{workout.title} crushed!</p>
          <div style={styles.completeBadge}><span style={styles.badgeIcon}>🏆</span><span>+1 Day Conquered</span></div>
          <button onClick={onBack} style={styles.backToCalendar}>Back to Calendar</button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.workoutContainer}>
      <div style={styles.workoutHeader}>
        <button onClick={onBack} style={styles.backButton}>← Back</button>
        <div style={styles.dayBadge}>
          <span>Day {day}</span>
          <span style={styles.workoutType}>{workout.title}</span>
        </div>
        {isCompleted && <span style={styles.alreadyComplete}>✓ Done</span>}
      </div>
      
      <div style={styles.workoutProgress}>
        <div style={{ ...styles.workoutProgressFill, width: `${progress}%` }} />
      </div>
      <p style={styles.exerciseCount}>Exercise {currentExercise + 1} of {totalExercises}</p>
      
      <div style={styles.timerSection}>
        <div style={{ ...styles.timerCircle, borderColor: isResting ? '#00FF88' : '#FF6B35' }}>
          <span style={styles.timerLabel}>{isResting ? 'REST' : 'WORK'}</span>
          <span style={styles.timerTime}>{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div style={styles.exerciseInfo}>
        <h2 style={styles.exerciseName}>{isResting ? 'Rest & Breathe' : exercise.name}</h2>
        {!isResting && <p style={styles.exerciseHint}>{exercise.rest > 0 ? `${exercise.rest}s rest after` : 'No rest'}</p>}
      </div>
      
      <div style={styles.workoutControls}>
        <button onClick={() => setIsRunning(!isRunning)}
          style={{ ...styles.playButton, background: isRunning ? '#FF4757' : '#00FF88' }}>
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={skipExercise} style={styles.skipButton}>Skip →</button>
      </div>
      
      <div style={styles.upNext}>
        <h4 style={styles.upNextTitle}>Coming Up:</h4>
        {workout.exercises.slice(currentExercise + 1, currentExercise + 4).map((ex, i) => (
          <div key={i} style={styles.upNextItem}>
            <span>{ex.name}</span>
            <span style={styles.upNextDuration}>{ex.duration}s</span>
          </div>
        ))}
      </div>
      
      <button onClick={restartWorkout} style={styles.restartButton}>🔄 Restart</button>
    </div>
  );
}

function ServerPage({ userData, squadCode, squadMembers, onCreateSquad, onJoinSquad, onLeaveSquad, joinCode, setJoinCode, onBack, error }) {
  const copyCode = () => {
    if (squadCode) {
      navigator.clipboard.writeText(squadCode);
      alert('Code copied!');
    }
  };
  
  return (
    <div style={styles.serverContainer}>
      <div style={styles.serverHeader}>
        <button onClick={onBack} style={styles.backButton}>← Back</button>
        <h1 style={styles.serverTitle}>Workout Squad</h1>
      </div>
      
      {!squadCode ? (
        <div style={styles.serverOptions}>
          <div style={styles.serverCard}>
            <h3 style={styles.cardTitle}>Create a Squad</h3>
            <p style={styles.cardDesc}>Start a new squad and invite friends</p>
            <button onClick={onCreateSquad} style={styles.createButton}>Create Squad</button>
          </div>
          
          <div style={styles.divider}><span>OR</span></div>
          
          <div style={styles.serverCard}>
            <h3 style={styles.cardTitle}>Join a Squad</h3>
            <p style={styles.cardDesc}>Enter the 6-digit code from your friend</p>
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="XXXXXX" maxLength={6} style={styles.codeInput} />
            {error && <p style={styles.errorText}>{error}</p>}
            <button onClick={onJoinSquad} style={styles.joinButton}>Join Squad</button>
          </div>
        </div>
      ) : (
        <div style={styles.serverActive}>
          <div style={styles.codeBox}>
            <span style={styles.codeLabel}>Squad Code</span>
            <span style={styles.codeValue}>{squadCode}</span>
            <button onClick={copyCode} style={styles.copyButton}>📋 Copy</button>
          </div>
          
          <p style={styles.shareHint}>Share this code with friends!</p>
          
          <div style={styles.membersSection}>
            <h3 style={styles.membersTitle}>Squad Members ({squadMembers.length})</h3>
            
            {squadMembers.map((member, i) => (
              <div key={i} style={styles.memberCard}>
                <div style={styles.memberAvatar}>{member.name?.charAt(0)?.toUpperCase() || '?'}</div>
                <div style={styles.memberInfo}>
                  <span style={styles.memberName}>{member.name} {member.id === userData.id && '(You)'}</span>
                  <div style={styles.memberStats}>
                    <span style={styles.statBadge}>🔥 {member.completedDays?.length || 0}/75</span>
                    <span style={styles.statBadge}>📅 {new Date(member.startDate).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.miniProgress}>
                    <div style={{ ...styles.miniProgressFill, width: `${((member.completedDays?.length || 0) / 75) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={onLeaveSquad} style={styles.leaveButton}>Leave Squad</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 50%, #16213E 100%)', fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", color: '#FFFFFF' },
  loadingScreen: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 100%)' },
  loadingPulse: { animation: 'pulse 1.5s infinite', fontSize: '64px' },
  loadingText: { marginTop: '20px', color: '#888', fontFamily: "'Inter', sans-serif", fontSize: '14px', letterSpacing: '2px' },
  landingContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', background: 'radial-gradient(ellipse at top, #1A1A2E 0%, #0D0D0D 70%)' },
  heroSection: { textAlign: 'center', marginBottom: '40px' },
  fireEmoji: { fontSize: '80px', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255, 107, 53, 0.8))' },
  heroTitle: { fontSize: 'clamp(60px, 15vw, 120px)', margin: 0, background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFB347 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '8px' },
  heroSubtitle: { fontSize: 'clamp(40px, 10vw, 80px)', margin: 0, color: '#00FF88', textShadow: '0 0 40px rgba(0, 255, 136, 0.5)', letterSpacing: '15px' },
  heroTagline: { fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#888', marginTop: '20px', letterSpacing: '3px', textTransform: 'uppercase' },
  formCard: { background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '400px', backdropFilter: 'blur(20px)' },
  formTitle: { fontSize: '18px', letterSpacing: '4px', textAlign: 'center', marginBottom: '30px', color: '#FF6B35' },
  inputGroup: { marginBottom: '24px' },
  inputLabel: { display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '8px' },
  textInput: { width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FFF', fontSize: '16px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' },
  dateInput: { width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FFF', fontSize: '16px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' },
  errorText: { color: '#FF4757', fontFamily: "'Inter', sans-serif", fontSize: '13px', marginBottom: '16px', textAlign: 'center' },
  startButton: { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)', border: 'none', borderRadius: '12px', color: '#000', fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px', cursor: 'pointer', boxShadow: '0 8px 30px rgba(255, 107, 53, 0.4)' },
  features: { display: 'flex', justifyContent: 'space-around', marginTop: '30px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' },
  featureItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888' },
  featureIcon: { fontSize: '24px' },
  calendarContainer: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  calendarTitle: { fontSize: '28px', margin: 0, letterSpacing: '2px' },
  calendarSubtitle: { fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#888', marginTop: '4px' },
  serverButton: { padding: '12px 20px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#FFF', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  progressSection: { marginBottom: '20px' },
  progressBar: { height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #00FF88 0%, #00D9FF 100%)', borderRadius: '4px', transition: 'width 0.5s ease' },
  progressStats: { display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#888' },
  legendRow: { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888' },
  legendDot: { width: '10px', height: '10px', borderRadius: '50%' },
  calendarGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  weekRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  weekLabel: { width: '30px', fontSize: '11px', color: '#555', fontFamily: "'Inter', sans-serif" },
  dayCell: { flex: 1, aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid transparent', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', minWidth: '36px' },
  dayCellCompleted: { background: 'rgba(0, 255, 136, 0.15)', borderColor: '#00FF88' },
  dayCellToday: { background: 'rgba(255, 107, 53, 0.2)', borderColor: '#FF6B35', boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)' },
  dayCellMissed: { background: 'rgba(255, 71, 87, 0.15)', borderColor: '#FF4757' },
  dayCellFuture: { opacity: 0.5 },
  dayCellRest: { background: 'rgba(100, 100, 255, 0.1)' },
  dayNumber: { fontSize: '14px', fontWeight: 'bold' },
  checkmark: { fontSize: '10px', color: '#00FF88', position: 'absolute', top: '2px', right: '4px' },
  restIndicator: { fontSize: '8px', color: '#8888FF', position: 'absolute', bottom: '2px' },
  resetButton: { width: '100%', padding: '14px', marginTop: '20px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#888', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '14px' },
  workoutContainer: { padding: '20px', maxWidth: '500px', margin: '0 auto', minHeight: '100vh' },
  workoutHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backButton: { padding: '10px 16px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '14px' },
  dayBadge: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  workoutType: { fontSize: '12px', color: '#FF6B35', letterSpacing: '2px' },
  alreadyComplete: { color: '#00FF88', fontSize: '12px', fontFamily: "'Inter', sans-serif" },
  workoutProgress: { height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' },
  workoutProgressFill: { height: '100%', background: 'linear-gradient(90deg, #FF6B35 0%, #00FF88 100%)', transition: 'width 0.3s' },
  exerciseCount: { textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#888', marginBottom: '30px' },
  timerSection: { display: 'flex', justifyContent: 'center', marginBottom: '30px' },
  timerCircle: { width: '200px', height: '200px', borderRadius: '50%', border: '6px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.3)' },
  timerLabel: { fontSize: '14px', letterSpacing: '4px', marginBottom: '8px', opacity: 0.7 },
  timerTime: { fontSize: '56px', fontWeight: 'bold', letterSpacing: '4px' },
  exerciseInfo: { textAlign: 'center', marginBottom: '30px' },
  exerciseName: { fontSize: '28px', letterSpacing: '2px', marginBottom: '8px' },
  exerciseHint: { fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#888' },
  workoutControls: { display: 'flex', gap: '12px', marginBottom: '30px' },
  playButton: { flex: 2, padding: '18px', border: 'none', borderRadius: '12px', color: '#000', fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' },
  skipButton: { flex: 1, padding: '18px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '12px', color: '#FFF', fontSize: '14px', cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
  upNext: { background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '20px', marginBottom: '20px' },
  upNextTitle: { fontSize: '12px', letterSpacing: '2px', color: '#888', marginBottom: '12px' },
  upNextItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontFamily: "'Inter', sans-serif", fontSize: '14px' },
  upNextDuration: { color: '#888' },
  restartButton: { width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#888', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '14px' },
  completeScreen: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' },
  confetti: { fontSize: '80px', marginBottom: '20px' },
  completeTitle: { fontSize: '48px', background: 'linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' },
  completeSubtitle: { fontFamily: "'Inter', sans-serif", fontSize: '16px', color: '#888', marginBottom: '30px' },
  completeBadge: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', background: 'rgba(255, 183, 71, 0.1)', border: '1px solid rgba(255, 183, 71, 0.3)', borderRadius: '50px', marginBottom: '40px' },
  badgeIcon: { fontSize: '24px' },
  backToCalendar: { padding: '16px 32px', background: 'linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)', border: 'none', borderRadius: '12px', color: '#000', fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' },
  serverContainer: { padding: '20px', maxWidth: '500px', margin: '0 auto', minHeight: '100vh' },
  serverHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  serverTitle: { fontSize: '24px', letterSpacing: '2px' },
  serverOptions: { display: 'flex', flexDirection: 'column', gap: '20px' },
  serverCard: { background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '30px', textAlign: 'center' },
  cardTitle: { fontSize: '20px', letterSpacing: '2px', marginBottom: '10px' },
  cardDesc: { fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#888', marginBottom: '20px' },
  createButton: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)', border: 'none', borderRadius: '12px', color: '#000', fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' },
  divider: { textAlign: 'center', color: '#555', fontFamily: "'Inter', sans-serif", fontSize: '12px' },
  codeInput: { width: '100%', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FFF', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold', marginBottom: '16px', boxSizing: 'border-box' },
  joinButton: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)', border: 'none', borderRadius: '12px', color: '#000', fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' },
  serverActive: {},
  codeBox: { background: 'rgba(0, 255, 136, 0.1)', border: '2px solid rgba(0, 255, 136, 0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '12px' },
  codeLabel: { display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '8px' },
  codeValue: { display: 'block', fontSize: '36px', letterSpacing: '8px', color: '#00FF88', marginBottom: '12px' },
  copyButton: { padding: '10px 20px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '13px' },
  shareHint: { textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#888', marginBottom: '30px' },
  membersSection: { marginBottom: '30px' },
  membersTitle: { fontSize: '14px', letterSpacing: '2px', color: '#888', marginBottom: '16px' },
  memberCard: { display: 'flex', gap: '16px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', marginBottom: '12px' },
  memberAvatar: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', flexShrink: 0 },
  memberInfo: { flex: 1 },
  memberName: { display: 'block', fontSize: '16px', marginBottom: '8px' },
  memberStats: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' },
  statBadge: { fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#888' },
  miniProgress: { height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' },
  miniProgressFill: { height: '100%', background: 'linear-gradient(90deg, #00FF88 0%, #00D9FF 100%)', transition: 'width 0.3s' },
  leaveButton: { width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(255, 71, 87, 0.3)', borderRadius: '12px', color: '#FF4757', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '14px' },
};
