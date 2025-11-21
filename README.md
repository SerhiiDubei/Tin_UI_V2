# 🔥 Tinder AI Feedback Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

**AI платформа, що генерує персоналізований контент на основі ваших вподобань через Tinder-style swipe інтерфейс.**

---

## ✨ Ключові Можливості

### 🎨 AI Content Generation
- **Seedream 4.0 Integration** - Реалістичні smartphone фото з 11-параметровою системою
- **Smart Prompting** - GPT-4o покращує промпти з врахуванням insights
- **Authentic Imperfections** - Motion blur, lens flare, tilted horizon для реалізму
- **Era Consistency** - Підтримка 2010-2024 (iPhone 4S → iPhone 14 Pro)
- **Batch Generation** - До 10 унікальних варіацій одночасно

### 👆 Tinder-Style Interface
- **← Left** - Dislike (з опціональним коментарем)
- **→ Right** - Like
- **↑ Up** - Superlike
- **↓ Down** - Skip (можна оцінити пізніше)

### 🧠 Intelligent Learning
- **User Insights** - OpenAI аналізує коментарі та витягує preferences
- **Automated Updates** - Insights оновлюються кожні 10 ratings
- **Personalization** - Кожна генерація враховує ваші вподобання
- **Category Detection** - Автоматичне визначення dating/nature/architecture

### 📊 Analytics Dashboard
- **Real-time Stats** - Likes, dislikes, like rate
- **Top Content** - Найкращий згенерований контент
- **Insights Visualization** - Ваші переваги в structured форматі

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase Account
- Replicate API Key
- OpenAI API Key

### Installation

```bash
# 1. Clone repository
git clone https://github.com/SerhiiDubei/Tin_UI_V2.git
cd Tin_UI_V2

# 2. Interactive setup
npm install
node scripts/setup.js

# 3. Setup database
# - Go to Supabase Dashboard → SQL Editor
# - Run database/migrations/*.sql files

# 4. Create Storage Bucket
# - Supabase → Storage → New Bucket
# - Name: generated-content
# - Public: YES

# 5. Install dependencies & run
npm run install:all
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- React Router DOM 6
- Axios
- CSS3

### Backend
- Node.js 18+
- Express 4.21
- Supabase PostgreSQL
- OpenAI GPT-4o / GPT-4o-mini
- Replicate API (ByteDance Seedream-4)

### AI Integration
- **Seedream 4.0** - 11-parameter smartphone photo system
- **OpenAI GPT-4o** - Prompt enhancement (800 tokens)
- **OpenAI GPT-4o-mini** - Category detection, comment analysis
- **Replicate** - Image generation

---

## 📁 Project Structure

```
Tin_UI_V2/
├── frontend/                 # React App
│   └── src/
│       ├── components/       # UI Components
│       ├── pages/            # Pages
│       └── services/         # API Client
│
├── backend/                  # Express API
│   └── src/
│       ├── services/
│       │   ├── openai.service.js      # 🆕 Seedream 4.0
│       │   ├── replicate.service.js
│       │   └── insights.service.js
│       └── routes/
│
├── database/                 # Database Schema
│   └── migrations/
│
└── docs/                     # Documentation
    ├── ARCHITECTURE.md       # 📊 ER + IR Diagrams
    └── SEEDREAM.md          # 📱 Seedream 4.0 Guide
```

---

## 🗄️ Database Schema

### 5 Core Tables:

```
users ←─ content ←─ ratings
         ↓
    user_insights

prompt_templates ─→ content
```

1. **users** - User accounts (auth)
2. **prompt_templates** - AI templates with insights
3. **content** - Generated content (images/video)
4. **ratings** - User feedback (swipes + comments)
5. **user_insights** - Learned preferences

**Details:** See [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🎯 How It Works

### 1. Content Generation Flow

```
User Prompt
    ↓
Detect Category (GPT-4o-mini)
    ↓
Fetch User Insights (from ratings + comments)
    ↓
Enhance Prompt (GPT-4o + Seedream 4.0)
    ↓
Generate Image (Replicate Seedream-4)
    ↓
Save to Database & Storage
    ↓
Return URL
```

### 2. Learning Flow

```
User Swipes (left/right/up/down)
    ↓
Save Rating (+ optional comment)
    ↓
Every 10 Ratings:
    ↓
Analyze Comments (GPT-4o-mini)
    ↓
Extract Keywords (likes/dislikes)
    ↓
Update user_insights
    ↓
Next Generation Uses Insights
```

---

## 📱 Seedream 4.0 System

### 11-Parameter Modular System

**TIER 1 - MANDATORY:**
1. SMARTPHONE_PHOTO_STYLE (filename, device, era)
2. SUBJECT (person description)

**TIER 2 - SITUATIONAL (3-4):**
3. COMPOSITION (framing, angles)
4. BACKGROUND (setting)
5. LIGHTING (source, direction)

**TIER 3 - ENHANCEMENT (1-2):**
6. COLOR_PALETTE
7. MOOD_ATMOSPHERE
8. MOTION_DYNAMICS
9. DEPTH_FOCUS
10. TEXTURE_DETAIL
11. TIME_WEATHER

### Example Output:

```
IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic.

A 26-year-old woman with shoulder-length blonde hair and subtle 
freckles, genuine smile while sitting at a café table. Close-up 
shot from slightly above eye level, subject positioned using rule 
of thirds. Soft natural window light from the left creating gentle 
shadows on the right side of face. Warm, inviting atmosphere with 
slightly boosted saturation. Slight motion blur on hands, small 
lens flare visible in upper right corner.
```

**Details:** See [SEEDREAM.md](./docs/SEEDREAM.md)

---

## 🔧 API Endpoints

### Content
```
POST   /api/content/generate         # Generate content
GET    /api/content/:id              # Get by ID
GET    /api/content/random/next      # Random for swipe
```

### Ratings
```
POST   /api/ratings                  # Create rating
GET    /api/ratings                  # List ratings
GET    /api/ratings/stats            # User statistics
```

### Insights
```
GET    /api/insights/user/:userId           # Get insights
POST   /api/insights/user/:userId/update    # Trigger update
GET    /api/insights/dashboard               # Dashboard data
```

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Prompt Length** | 300-500 chars |
| **Parameters Used** | 5-7 / 11 |
| **Generation Time** | 35-40 sec |
| **OpenAI Tokens** | 600-800 |
| **Cost per Image** | ~$0.034 |
| **Realism Level** | HIGH ✨ |

---

## 🚀 Deployment

### Frontend (Vercel/GitHub Pages)
```bash
npm run build:frontend
# Deploy build/ directory
```

### Backend (Vercel/Railway)
```bash
# Set environment variables:
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
REPLICATE_API_TOKEN=...

# Deploy backend/ directory
```

---

## 📚 Documentation

- **README.md** (this file) - Overview & Quick Start
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - ER Diagrams, Database Schema, Architecture
- **[SEEDREAM.md](./docs/SEEDREAM.md)** - Seedream 4.0 Integration Guide

---

## 🐛 Troubleshooting

### Images expire after 24-48h
✅ **Fixed!** Now using Supabase Storage for permanent URLs.

### No insights updating
- Check that you have 10+ ratings with comments
- Trigger manually: `POST /api/insights/user/:userId/update`

### OpenAI errors
- Check API key is valid
- Verify billing is active
- Check rate limits

---

## ✅ Project Status

**Version:** 1.2.0  
**Last Updated:** 2025-11-21  
**Status:** ✅ **PRODUCTION READY**

### Recent Updates:

**v1.2.0 (2025-11-21):**
- ✅ Seedream 4.0 Integration (11-parameter system)
- ✅ Enhanced prompt generation (300-500 chars)
- ✅ Era consistency (2010-2024)
- ✅ Authentic imperfections
- ✅ Parameter detection & validation
- ✅ Comprehensive documentation

**v1.1.0 (2025-10-27):**
- ✅ Permanent Storage (Supabase)
- ✅ URL Migration Tool
- ✅ Auto-download on generation

**v1.0.0:**
- ✅ Full frontend + backend
- ✅ User authentication
- ✅ AI Learning System
- ✅ Batch generation
- ✅ Admin Panel

---

## 🤝 Contributing

Contributions welcome! 

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open Pull Request

---

## 📧 Contact

**Repository:** https://github.com/SerhiiDubei/Tin_UI_V2  
**Issues:** https://github.com/SerhiiDubei/Tin_UI_V2/issues

---

Made with ❤️ by SerhiiDubei
