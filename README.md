# 🔥 Tinder AI Feedback Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

**Платформа для збору людського фідбеку через Tinder-подібний swipe інтерфейс для покращення AI моделей генерації контенту.**

An AI-powered platform that learns your preferences through Tinder-style swipes and generates personalized content based on your feedback. The system uses advanced machine learning to analyze user behavior and continuously improve content generation quality.

---

## ✨ Features

### 🎨 AI Content Generation
- **Image Generation**: High-quality images via Replicate API (Stable Diffusion, SDXL Lightning)
- **Video Generation**: AI-generated videos with customizable parameters
- **Smart Prompting**: OpenAI GPT-4o enhances prompts with learned context
- **Multiple Models**: Support for various generation models

### 👆 Tinder-like Swipe Interface
- **Intuitive Gestures**:
  - **← Left**: Dislike (with optional comment)
  - **→ Right**: Like
  - **↑ Up**: Superlike (with mandatory comment)
  - **↓ Down**: Skip/Reroll
- **Fast Feedback**: Average response time tracking
- **Mobile-First Design**: Responsive UI for all devices

### 🧠 Intelligent Learning System
- **LLM-based Analysis**: GPT-4o-mini analyzes user comments for deeper insights
- **Incremental Updates**: System updates preferences every 10 swipes
- **Personalized Insights**: Each user has unique preference profile
- **Template Learning**: Prompts accumulate patterns over time
- **Auto-triggers**: Database triggers auto-update statistics

### 👤 Personalization
- **User Profiles**: Individual preference tracking per user
- **Like/Dislike Patterns**: System learns what you prefer
- **Suggestion Integration**: User feedback directly improves prompts
- **Export Data**: Download your complete preference history

### 📊 Real-time Analytics Dashboard
- **Overall Statistics**: Total content, swipes, like rate, response time
- **Top Content**: View highest-rated generated items
- **Insight Visualization**: See your preferences mapped out
- **Template Performance**: Track which prompts perform best

### 🔄 Continuous Improvement
- **Feedback Loop**: Swipe → Rating → Analysis → Updated Insights → Better Generation
- **Comment Analysis**: Natural language processing of user feedback
- **Weighted Learning**: Superlike/dislike comments carry more weight
- **Real-time Updates**: Changes reflect immediately in new generations

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Supabase Account** ([Sign up](https://supabase.com/))
- **Replicate API Key** ([Get key](https://replicate.com/))
- **OpenAI API Key** ([Get key](https://platform.openai.com/))

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/tinder-ai-feedback.git
cd tinder-ai-feedback
```

#### Step 2: Run Interactive Setup

```bash
npm install
node scripts/setup.js
```

The setup script will prompt you for:
- Supabase URL
- Supabase Anon Key
- Replicate API Token
- OpenAI API Key

It will automatically create `.env` files for both frontend and backend.

#### Step 3: Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → SQL Editor
3. Copy the contents of `database/migrations/001_initial_schema.sql`
4. Run the SQL migration
5. Verify tables are created: `prompt_templates`, `content`, `ratings`, `user_insights`

#### Step 4: Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for root, frontend, and backend.

#### Step 5: Start Development Servers

```bash
npm run dev
```

This starts both frontend and backend concurrently:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/health

---

## 📁 Project Structure

```
tinder-ai-feedback/
│
├── frontend/                    # React 18 Frontend
│   ├── public/                  # Static assets
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Loading/
│   │   │   ├── Modal/
│   │   │   └── SwipeCard/       # Core swipe component
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useSwipe.js      # Swipe logic & state
│   │   ├── pages/               # Page components
│   │   │   ├── SwipePage.jsx    # Main swipe interface
│   │   │   ├── DashboardPage.jsx # Analytics dashboard
│   │   │   └── SettingsPage.jsx  # User settings
│   │   ├── services/            # API integration
│   │   │   └── api.js           # API client
│   │   ├── utils/               # Helper functions
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx              # Main app with routing
│   │   ├── App.css
│   │   ├── index.js             # Entry point
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── config/              # Configuration
│   │   │   └── index.js
│   │   ├── db/                  # Database connection
│   │   │   └── supabase.js
│   │   ├── services/            # Business logic
│   │   │   ├── openai.service.js   # GPT-4o integration
│   │   │   ├── replicate.service.js # Image/video generation
│   │   │   └── insights.service.js  # Learning & analysis
│   │   ├── routes/              # API endpoints
│   │   │   ├── content.routes.js   # Content CRUD
│   │   │   ├── ratings.routes.js   # Swipe ratings
│   │   │   ├── insights.routes.js  # User insights
│   │   │   └── index.js
│   │   └── server.js            # Express server
│   ├── package.json
│   └── .env.example
│
├── database/                    # Database schemas
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete database setup
│
├── scripts/                     # Utility scripts
│   └── setup.js                 # Interactive setup
│
├── package.json                 # Root package.json (monorepo)
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM** - Client-side routing
- **CSS3** - Styling with custom components
- **Fetch API** - HTTP requests

### Backend
- **Node.js 18+** - Runtime
- **Express 4.21** - Web framework
- **Supabase** - PostgreSQL database & auth
- **OpenAI API** - GPT-4o for prompt enhancement & comment analysis
- **Replicate API** - Image & video generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **PostgreSQL (Supabase)** - Main database
- **UUID** - Primary keys
- **JSONB** - Flexible insight storage
- **Triggers** - Auto-update statistics
- **Indexes** - Performance optimization

### AI/ML
- **OpenAI GPT-4o** - Prompt enhancement (high quality)
- **OpenAI GPT-4o-mini** - Comment analysis (cost-effective)
- **Replicate Models**:
  - `bytedance/sdxl-lightning-4step` - Fast image generation
  - Custom models supported

---

## 🔌 API Endpoints

### Content
- `POST /api/content/generate` - Generate new content
- `GET /api/content/:id` - Get content by ID
- `GET /api/content` - List all content
- `GET /api/content/random/next` - Get random unrated content

### Ratings
- `POST /api/ratings` - Create rating (swipe)
- `GET /api/ratings` - List ratings with filters
- `GET /api/ratings/stats` - Get user statistics

### Insights
- `GET /api/insights/user/:userId` - Get user insights
- `POST /api/insights/user/:userId/update` - Manually update insights
- `GET /api/insights/template/:templateId` - Get template insights
- `GET /api/insights/dashboard` - Dashboard overview

### Health
- `GET /api/health` - API health check

---

## 🗄️ Database Schema

### Tables

#### `prompt_templates`
Stores AI prompt templates with learned insights.

```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- base_prompt (TEXT)
- system_instructions (TEXT)
- likes (JSONB) - Array of liked keywords
- dislikes (JSONB) - Array of disliked keywords
- suggestions (JSONB) - Array of suggestions
- created_at, updated_at (TIMESTAMP)
```

#### `content`
Generated content items (images/videos).

```sql
- id (UUID, PK)
- template_id (UUID, FK)
- original_prompt (TEXT)
- enhanced_prompt (TEXT)
- url (TEXT)
- media_type (TEXT) - 'image' or 'video'
- generation_params (JSONB)
- like_count, dislike_count, superlike_count (INT)
- avg_rating (FLOAT)
- total_ratings (INT)
- created_at (TIMESTAMP)
```

#### `ratings`
User feedback on content.

```sql
- id (UUID, PK)
- content_id (UUID, FK)
- user_id (UUID)
- direction (TEXT) - 'left', 'right', 'up', 'down'
- comment (TEXT)
- latency_ms (INT) - Response time
- user_weight (FLOAT) - Importance weight
- created_at (TIMESTAMP)
- UNIQUE(content_id, user_id) - Prevent duplicates
```

#### `user_insights`
Personal preference profiles.

```sql
- user_id (UUID, PK)
- likes (JSONB) - Array of liked keywords
- dislikes (JSONB) - Array of disliked keywords
- suggestions (JSONB) - Array of suggestions
- total_swipes (INT)
- like_rate (FLOAT)
- updated_at (TIMESTAMP)
```

### Triggers
- `update_content_stats()` - Auto-updates content statistics after ratings
- `update_updated_at_column()` - Auto-updates timestamps

---

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# AI Services
REPLICATE_API_TOKEN=your_replicate_token
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEFAULT_USER_ID=demo-user-123
```

---

## 🧪 Development

### Running Servers

```bash
# Start both frontend and backend
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend
```

### Building for Production

```bash
# Build frontend
npm run build:frontend

# The build output will be in frontend/build/
```

### Scripts

- `npm run install:all` - Install all dependencies
- `npm run dev` - Start dev servers (concurrently)
- `npm run dev:frontend` - Start React dev server
- `npm run dev:backend` - Start Express server (nodemon)
- `npm run build:frontend` - Build React for production
- `node scripts/setup.js` - Interactive setup wizard

---

## 📊 How It Works

### 1. Content Generation Flow

```
User Request → Backend receives prompt
           ↓
Backend retrieves template + user insights
           ↓
OpenAI GPT-4o enhances prompt with context
           ↓
Replicate generates image/video
           ↓
Content saved to database
           ↓
URL returned to frontend
```

### 2. Swipe & Learning Flow

```
User swipes content
           ↓
Frontend records: direction, comment, latency
           ↓
Backend creates rating in database
           ↓
Check: Is this the 10th swipe?
           ↓
YES: Trigger insights update
           ↓
OpenAI GPT-4o-mini analyzes comments
           ↓
Extract likes, dislikes, suggestions
           ↓
Update user_insights table
           ↓
Update template insights
           ↓
Next generation uses updated insights
```

### 3. Insights Analysis

**Comment Analysis Example:**

Input:
```
Comments from user:
- "I love the vibrant colors!"
- "Too dark, needs more lighting"
- "Amazing composition"
```

GPT-4o-mini Output:
```json
{
  "likes": ["vibrant colors", "composition"],
  "dislikes": ["dark lighting"],
  "suggestions": ["increase brightness", "maintain color vibrancy"]
}
```

**Prompt Enhancement Example:**

Original Prompt:
```
"A beautiful sunset"
```

Enhanced Prompt (with user insights):
```
"A beautiful sunset with vibrant colors and bright lighting, 
professional composition, high quality, detailed"
```

---

## 🎯 Usage Guide

### For Users

1. **Start Swiping**: Open http://localhost:3000/swipe
2. **Rate Content**:
   - Swipe **right** for content you like
   - Swipe **left** for content you dislike (optional comment)
   - Swipe **up** for content you love (mandatory comment)
   - Swipe **down** to skip
3. **Track Progress**: View your stats on http://localhost:3000/dashboard
4. **Customize**: Adjust settings at http://localhost:3000/settings

### For Developers

1. **Add New Models**: Update `backend/src/services/replicate.service.js`
2. **Customize Analysis**: Modify `backend/src/services/openai.service.js`
3. **Extend Insights**: Update database schema and insight logic
4. **Add Components**: Create new React components in `frontend/src/components/`

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Backend won't start
- **Solution**: Check `.env` file exists and has valid API keys
- Verify Supabase URL and key are correct
- Run `npm install` in `backend/` directory

**Issue**: Frontend can't connect to API
- **Solution**: Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `frontend/.env`
- Verify CORS_ORIGINS includes your frontend URL

**Issue**: Database tables not found
- **Solution**: Run the migration SQL in Supabase dashboard
- Copy entire `database/migrations/001_initial_schema.sql` content
- Execute in SQL Editor

**Issue**: AI generation fails
- **Solution**: Verify Replicate API token is valid
- Check OpenAI API key has sufficient credits
- Review backend logs for specific error messages

---

## 🚀 Deployment

### Frontend (GitHub Pages)

1. Update `package.json` homepage:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/tinder-ai-feedback"
   ```

2. Build and deploy:
   ```bash
   npm run build:frontend
   # Deploy the frontend/build/ folder to GitHub Pages
   ```

### Backend (Railway / Render)

1. Connect your GitHub repository
2. Set environment variables in platform dashboard
3. Deploy from `backend/` directory
4. Update `REACT_APP_API_URL` in frontend to production URL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation if needed

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o and GPT-4o-mini
- **Replicate** for AI model hosting
- **Supabase** for database and infrastructure
- **React** community for amazing tools

---

## 📧 Contact

**Project Link**: https://github.com/YOUR_USERNAME/tinder-ai-feedback

**Issues**: https://github.com/YOUR_USERNAME/tinder-ai-feedback/issues

---

Made with ❤️ and 🔥 by the Tinder AI Feedback Team
