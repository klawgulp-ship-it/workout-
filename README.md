# 🔥 75 Day Hard - Glutes & Abs Challenge

A workout app where you and your friends can do a 75-day challenge together!

---

## 📁 What's In This Folder? (For Beginners)

```
75day-app/
├── frontend/          ← The website your users see (React)
│   ├── src/           ← Source code files
│   │   ├── App.jsx    ← Main app code
│   │   └── main.jsx   ← Entry point
│   ├── public/        ← Static files (images, icons)
│   ├── index.html     ← HTML template
│   ├── package.json   ← List of dependencies
│   └── vite.config.js ← Build settings
│
├── backend/           ← The server that saves data (Node.js)
│   ├── server.js      ← API code
│   └── package.json   ← List of dependencies
│
└── README.md          ← This file!
```

**What is "src"?** = "source" - where your code lives
**What is "package.json"?** = A shopping list of tools your app needs

---

## 🚀 HOW TO DEPLOY TO RAILWAY (Step by Step)

### STEP 1: Get a GitHub Account (if you don't have one)

1. Go to **[github.com](https://github.com)**
2. Click **Sign Up**
3. Create your account (it's free!)

---

### STEP 2: Install Git on Your Computer

**Windows:**
1. Download from [git-scm.com/download/win](https://git-scm.com/download/win)
2. Run the installer, click Next through everything

**Mac:**
1. Open Terminal (search "Terminal" in Spotlight)
2. Type: `git --version`
3. If not installed, it will prompt you to install

---

### STEP 3: Upload Your Code to GitHub

1. **Unzip this folder** to your Desktop

2. **Open Terminal (Mac) or Command Prompt (Windows)**
   - Mac: Search "Terminal" in Spotlight
   - Windows: Search "cmd" in Start menu

3. **Navigate to the folder:**
   ```bash
   cd Desktop/75day-app
   ```

4. **Create a GitHub repository:**
   - Go to [github.com/new](https://github.com/new)
   - Name it: `75day-challenge`
   - Click **Create repository**
   - DON'T check any boxes, just create empty repo

5. **Push your code (copy/paste these commands one at a time):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/75day-challenge.git
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username!

---

### STEP 4: Deploy Backend to Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **Login** → **Login with GitHub**
3. Click **New Project**
4. Click **Deploy from GitHub repo**
5. Select your `75day-challenge` repo
6. Railway will ask which folder - select **backend**

7. **Add PostgreSQL Database:**
   - In your Railway project, click **+ New**
   - Select **Database** → **PostgreSQL**
   - Wait for it to provision

8. **Connect Database to Backend:**
   - Click on your backend service
   - Go to **Variables** tab
   - Click **Add Variable Reference**
   - Select `DATABASE_URL` from the PostgreSQL service

9. **Get Your Backend URL:**
   - Click on backend service
   - Go to **Settings** → **Networking**
   - Click **Generate Domain**
   - Copy the URL (looks like: `https://something.up.railway.app`)

---

### STEP 5: Deploy Frontend to Railway

1. In your Railway project, click **+ New** → **GitHub Repo**
2. Select same repo, but this time select **frontend** folder

3. **Add Environment Variable:**
   - Click on frontend service
   - Go to **Variables** tab
   - Click **+ New Variable**
   - Name: `VITE_API_URL`
   - Value: Your backend URL from Step 4 (the `https://something.up.railway.app`)

4. **Generate Frontend URL:**
   - Go to **Settings** → **Networking**
   - Click **Generate Domain**
   - This is your app's live URL! 🎉

---

### STEP 6: You're Done! 🎉

Share your frontend URL with friends! They can:
- Create their own accounts
- Create or join squads with a code
- See each other's progress in real-time!

---

## 🔧 Common Issues

### "Command not found: git"
→ Install Git (see Step 2)

### "Permission denied"
→ Make sure you're logged into GitHub:
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

### "Repository not found"
→ Double-check your GitHub username in the URL

### App shows "Failed to create account"
→ Make sure:
1. Backend is deployed and has DATABASE_URL variable
2. Frontend has VITE_API_URL pointing to backend
3. Both services are running (check Railway dashboard)

---

## 💡 How Squad Sync Works

1. User A creates a squad → Gets code like "ABC123"
2. User A shares code with friends
3. Friends enter code to join
4. Everyone's progress syncs every 5 seconds
5. You can see when friends complete days!

---

## 🏋️ Features

- **75 days of workouts** - Glutes & abs focused
- **30-minute sessions** - Timed exercises with rest
- **Built-in timers** - Work timer + rest timer
- **Progress calendar** - See completed/missed days
- **Squad system** - Workout with friends
- **Real-time sync** - See friends' progress live!

---

## Need Help?

If you're stuck, the Railway Discord is helpful: [discord.gg/railway](https://discord.gg/railway)

Good luck with your 75 days! 💪🔥
