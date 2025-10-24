# 🚀 Quick Start Guide

Get the Tinder AI Feedback Platform running in **5 minutes**!

---

## ⚡ Prerequisites

Before you start, make sure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **Supabase account** ([Sign up free](https://supabase.com/))
- ✅ **Replicate API key** ([Get free key](https://replicate.com/))
- ✅ **OpenAI API key** ([Get key](https://platform.openai.com/))

---

## 📝 Step 1: Get API Keys

### Supabase Setup (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in details and click **"Create new project"**
4. Once ready, go to **Settings** → **API**
5. Copy these two values:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGc...
   ```

### Replicate Setup (1 minute)

1. Go to [Replicate](https://replicate.com/)
2. Sign up/login
3. Go to **Account** → **API Tokens**
4. Copy your token:
   ```
   Token: r8_xxxxx...
   ```

### OpenAI Setup (1 minute)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/login
3. Go to **API Keys**
4. Click **"Create new secret key"**
5. Copy your key:
   ```
   Key: sk-xxxxx...
   ```

---

## 💻 Step 2: Install and Configure (2 minutes)

```bash
# Navigate to project
cd /home/user/webapp/new-project

# Install all dependencies
npm run install:all

# Run interactive setup (paste your API keys when prompted)
node scripts/setup.js
```

The setup script will ask for:
1. Supabase URL
2. Supabase Anon Key
3. Replicate API Token
4. OpenAI API Key

It will automatically create `.env` files for both frontend and backend.

---

## 🗄️ Step 3: Setup Database (1 minute)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Open the file: `database/migrations/001_initial_schema.sql`
6. Copy **entire contents** and paste into SQL Editor
7. Click **"Run"** button
8. Verify success message appears

**What this does:**
- Creates 4 tables: `prompt_templates`, `content`, `ratings`, `user_insights`
- Sets up triggers for auto-updating statistics
- Adds seed data (dating_photos_v1 template)

---

## 🎯 Step 4: Start Development Servers (1 command)

```bash
npm run dev
```

This starts **both** frontend and backend:

- 🎨 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:5000
- 💚 **Health Check**: http://localhost:5000/api/health

**Wait for:**
```
webpack compiled successfully
[Backend] Server running on port 5000
[Backend] ✓ Connected to Supabase
```

---

## 🎮 Step 5: Use the App!

### Navigate to http://localhost:3000

You'll see 3 pages:

1. **👆 Swipe Page** (`/swipe`)
   - Swipe ← left to dislike
   - Swipe → right to like
   - Swipe ↑ up to superlike (with comment)
   - Swipe ↓ down to skip

2. **📊 Dashboard** (`/dashboard`)
   - View your statistics
   - See top content
   - Track preferences

3. **⚙️ Settings** (`/settings`)
   - Change user ID
   - Export your data
   - Reset insights

---

## 🧪 Verify Everything Works

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T13:00:00.000Z",
  "database": "connected"
}
```

### Test 2: Generate Content
```bash
curl -X POST http://localhost:5000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset",
    "userId": "test-user",
    "templateId": "dating_photos_v1"
  }'
```

### Test 3: Frontend Loads
Open http://localhost:3000 and check:
- ✅ Navigation bar appears
- ✅ No console errors
- ✅ Pages load without errors

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

---

### Issue: Backend won't start

**Solution:**
```bash
# Check .env file exists
ls backend/.env

# If missing, run setup again
node scripts/setup.js

# Check environment variables are set
cat backend/.env
```

---

### Issue: Database connection fails

**Solution:**
1. Verify Supabase URL and key in `backend/.env`
2. Check your Supabase project is active
3. Go to Supabase dashboard → check if database is running
4. Test connection:
   ```bash
   curl "https://YOUR_PROJECT.supabase.co/rest/v1/" \
     -H "apikey: YOUR_ANON_KEY"
   ```

---

### Issue: Tables not found

**Solution:**
1. Go to Supabase dashboard → Table Editor
2. If tables are missing, run migration again:
   - Open SQL Editor
   - Copy `database/migrations/001_initial_schema.sql`
   - Run the SQL

---

### Issue: Frontend can't reach backend

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check frontend .env
cat frontend/.env
# Should have: REACT_APP_API_URL=http://localhost:5000/api

# If wrong, fix it and restart:
npm run dev
```

---

### Issue: AI generation fails

**Solution:**
1. Check API keys in `backend/.env`:
   ```bash
   cat backend/.env | grep API
   ```
2. Verify keys are valid:
   - OpenAI: https://platform.openai.com/api-keys
   - Replicate: https://replicate.com/account/api-tokens
3. Check you have credits/quota remaining

---

## 📚 Next Steps

Once everything is working:

1. **Read full documentation**: `README.md`
2. **Explore the code**: Start with `frontend/src/App.jsx`
3. **Try swiping**: Generate and rate content
4. **View insights**: After 10 swipes, check dashboard
5. **Customize**: Add your own prompt templates
6. **Deploy**: See README.md for deployment instructions

---

## 🎓 Understanding the Flow

```
User Opens App
     ↓
Frontend loads SwipePage
     ↓
Request random content from API
     ↓
Backend fetches unrated content
     ↓
Returns URL to frontend
     ↓
User swipes (left/right/up/down)
     ↓
Frontend sends rating to API
     ↓
Backend saves to database
     ↓
Check: Is this 10th swipe?
     ↓ YES
OpenAI analyzes comments
     ↓
Update user_insights table
     ↓
Next generation uses updated insights!
```

---

## 💡 Pro Tips

### Tip 1: Use Multiple Terminals
```bash
# Terminal 1: Backend logs
cd /home/user/webapp/new-project/backend
npm run dev

# Terminal 2: Frontend logs
cd /home/user/webapp/new-project/frontend
npm start
```

### Tip 2: Watch Database Changes
- Open Supabase dashboard → Table Editor
- Watch tables update in real-time as you swipe!

### Tip 3: Test Different Users
```bash
# Change user ID in Settings page
# Or directly in frontend/.env:
REACT_APP_DEFAULT_USER_ID=user-123
```

### Tip 4: Force Insights Update
```bash
# Manually trigger update (don't wait for 10 swipes)
curl -X POST http://localhost:5000/api/insights/user/demo-user-123/update
```

### Tip 5: Clear Browser Cache
```bash
# If seeing stale data:
# In browser: Ctrl+Shift+R (hard reload)
# Or: Clear browser cache for localhost
```

---

## 📞 Getting Help

### Check Logs

**Backend logs:**
```bash
cd backend
npm run dev
# Watch terminal for errors
```

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors

**Database logs:**
- Supabase dashboard → Logs → Database

---

### Common Commands

```bash
# Start everything
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Install dependencies
npm run install:all

# Build for production
npm run build:frontend

# Run setup wizard
node scripts/setup.js
```

---

## ✅ Success Checklist

Before moving forward, verify:

- [ ] Node.js 18+ installed
- [ ] All API keys obtained
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Environment variables configured (`.env` files exist)
- [ ] Database migration run successfully
- [ ] Tables visible in Supabase Table Editor
- [ ] Backend running (http://localhost:5000/api/health returns OK)
- [ ] Frontend running (http://localhost:3000 loads)
- [ ] No console errors in browser
- [ ] Can generate content (test endpoint works)
- [ ] Can swipe content (frontend → backend → database flow works)

---

## 🎉 You're Ready!

Everything working? **Congratulations!** 🎊

You now have a fully functional AI-powered feedback platform running locally.

**What to do next:**
1. Generate some content
2. Swipe through 10 items
3. Check your dashboard to see insights
4. Read the full README.md for advanced features
5. Start customizing and extending!

---

**Time to complete**: ~5 minutes  
**Difficulty**: Beginner-friendly  
**Status**: ✅ Production ready

---

**Need more help?** Check `README.md` or `PROJECT_SUMMARY.md` for detailed information.

**Happy swiping!** 🔥👆
