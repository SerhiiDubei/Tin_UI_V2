# 📚 Технічна документація

## 📖 Зміст

1. [Архітектура системи](#архітектура-системи)
2. [База даних](#база-даних)
3. [API Endpoints](#api-endpoints)
4. [Система навчання AI](#система-навчання-ai)
5. [Аутентифікація](#аутентифікація)
6. [AI Services](#ai-services)
7. [Frontend Architecture](#frontend-architecture)
8. [Deployment](#deployment)

---

## 🏗️ Архітектура системи

### High-Level Overview

```
┌─────────────────┐
│   React Frontend│
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐      ┌─────────────────┐
│  Express Backend│─────→│   Supabase DB   │
│   (Port 5000)   │      │   PostgreSQL    │
└────────┬────────┘      └─────────────────┘
         │
         ├─→ OpenAI API (GPT-4o, GPT-4o-mini)
         └─→ Replicate API (Image/Video Gen)
```

### Компоненти

#### Frontend (React 18)
- **Pages**: SwipePage, DashboardPage, SettingsPage, LoginPage, AdminPage
- **Components**: SwipeCard, Button, Card, Loading, Modal, Navigation
- **Hooks**: useSwipe (custom hook для swipe логіки)
- **Services**: api.js (centralized API client)

#### Backend (Express)
- **Routes**: content, ratings, insights, auth, admin, learning
- **Services**: openai.service, replicate.service, insights.service
- **Middleware**: auth, errorHandler, logger
- **Database**: Supabase PostgreSQL

---

## 🗄️ База даних

### Схема

#### 1. `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
```

**Призначення**: Зберігання користувачів
**Ролі**: `user` - звичайний користувач, `admin` - адміністратор

---

#### 2. `prompt_templates`
```sql
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  base_prompt TEXT NOT NULL,
  system_instructions TEXT,
  category TEXT DEFAULT 'Dating',
  insights_json JSONB DEFAULT '{"likes": [], "dislikes": [], "suggestions": []}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Призначення**: Шаблони промптів з накопиченими insights
**insights_json структура**:
```json
{
  "likes": [
    {"keyword": "natural", "count": 25},
    {"keyword": "smile", "count": 20}
  ],
  "dislikes": [
    {"keyword": "fake", "count": 10}
  ],
  "suggestions": [
    "Focus on natural lighting",
    "Emphasize genuine smiles"
  ]
}
```

---

#### 3. `content`
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  template_id UUID REFERENCES prompt_templates(id),
  original_prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  meta_json JSONB DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  superlikes_count INTEGER DEFAULT 0,
  avg_rating FLOAT DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Призначення**: Згенерований контент
**meta_json містить**: `generation_params`, `model`, `steps`, тощо

---

#### 4. `ratings`
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'up', 'down')),
  comment TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, user_id)
);
```

**Призначення**: Свайпи користувачів
**Напрямки**:
- `left` - Dislike
- `right` - Like
- `up` - Superlike
- `down` - Skip

---

#### 5. `user_insights`
```sql
CREATE TABLE user_insights (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  likes_json JSONB DEFAULT '[]',
  dislikes_json JSONB DEFAULT '[]',
  total_swipes INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_dislikes INTEGER DEFAULT 0,
  total_superlikes INTEGER DEFAULT 0,
  gold_content_ids UUID[] DEFAULT ARRAY[]::UUID[],
  preferences_json JSONB DEFAULT '{}',
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Призначення**: Персональні переваги користувача
**Структура**:
```json
{
  "likes_json": [
    {"keyword": "natural", "count": 25},
    {"keyword": "smile", "count": 20}
  ],
  "dislikes_json": [
    {"keyword": "fake", "count": 10}
  ],
  "preferences_json": {
    "preferred_style": "realistic",
    "favorite_settings": ["outdoor", "beach"]
  }
}
```

---

#### 6. `ai_learnings`
```sql
CREATE TABLE ai_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  original_prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  response_data JSONB NOT NULL,
  category TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  generation_params JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Призначення**: База знань для покращення AI
**Використання**: Збір найкращих промптів (rating 4-5) для аналізу паттернів

---

### Triggers & Functions

#### Update content statistics
```sql
CREATE OR REPLACE FUNCTION update_content_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE content SET
    likes_count = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id AND direction = 'right'),
    dislikes_count = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id AND direction = 'left'),
    superlikes_count = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id AND direction = 'up'),
    total_ratings = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id)
  WHERE id = NEW.content_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_stats_trigger
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW EXECUTE FUNCTION update_content_stats();
```

---

## 🔌 API Endpoints

### Authentication

#### `POST /api/auth/register`
Реєстрація нового користувача

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

---

#### `POST /api/auth/login`
Логін користувача

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

---

### Content Generation

#### `POST /api/content/generate`
Генерування одного контенту

**Request:**
```json
{
  "prompt": "beautiful girl on the beach",
  "userId": "uuid",
  "templateId": "uuid",
  "mediaType": "image",
  "model": "bytedance/sdxl-lightning-4step"
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://replicate.delivery/...",
  "originalPrompt": "beautiful girl on the beach",
  "enhancedPrompt": "A beautiful young woman with natural features...",
  "mediaType": "image"
}
```

---

#### `POST /api/content/generate-batch`
Batch генерація (до 50 промптів)

**Request:**
```json
{
  "basePrompt": "beautiful dating profile photo",
  "count": 10,
  "userId": "uuid",
  "templateId": "uuid"
}
```

**Response:**
```json
{
  "total": 10,
  "successful": 9,
  "failed": 1,
  "contents": [
    {
      "id": "uuid",
      "url": "https://...",
      "prompt": "beautiful girl with natural smile..."
    }
  ],
  "errors": []
}
```

---

### Ratings

#### `POST /api/ratings`
Створити rating (swipe)

**Request:**
```json
{
  "contentId": "uuid",
  "userId": "uuid",
  "direction": "right",
  "comment": "I love the natural smile!",
  "latencyMs": 1500
}
```

**Response:**
```json
{
  "id": "uuid",
  "contentId": "uuid",
  "direction": "right",
  "comment": "I love the natural smile!",
  "createdAt": "2025-10-25T12:00:00Z"
}
```

---

### Insights

#### `GET /api/insights/user/:userId`
Отримати insights користувача

**Response:**
```json
{
  "userId": "uuid",
  "likes": [
    {"keyword": "natural", "count": 25},
    {"keyword": "smile", "count": 20}
  ],
  "dislikes": [
    {"keyword": "fake", "count": 10}
  ],
  "totalSwipes": 150,
  "totalLikes": 100,
  "likeRate": 0.67
}
```

---

#### `POST /api/insights/user/:userId/update`
Оновити insights (запускає аналіз)

**Response:**
```json
{
  "success": true,
  "insights": {
    "likes": [...],
    "dislikes": [...],
    "suggestions": [...]
  }
}
```

---

### AI Learning

#### `POST /api/learning/save`
Зберегти промпт та відповідь

**Request:**
```json
{
  "userId": "uuid",
  "originalPrompt": "beautiful girl",
  "enhancedPrompt": "A beautiful young woman...",
  "responseData": {
    "url": "https://...",
    "model": "sdxl-lightning"
  },
  "category": "Dating"
}
```

---

#### `POST /api/learning/:id/rate`
Оцінити промпт (1-5 зірок)

**Request:**
```json
{
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "learning": {
    "id": "uuid",
    "rating": 5
  }
}
```

---

## 🧠 Система навчання AI

### Життєвий цикл

```
1. Користувач генерує контент
           ↓
2. Промпт + відповідь → ai_learnings
           ↓
3. Користувач оцінює (1-5 зірок)
           ↓
4. Система збирає найкращі (rating >= 4)
           ↓
5. Аналіз паттернів через GPT-4o-mini
           ↓
6. Оновлення user_insights
           ↓
7. Наступна генерація використовує insights
```

### Comment Analysis

**Input:**
```javascript
const comments = [
  "I love the natural smile",
  "Too much makeup, looks fake",
  "Great outdoor lighting"
];
```

**GPT-4o-mini аналіз:**
```javascript
const analysis = await analyzeComments(comments);
// {
//   likes: ["natural", "smile", "outdoor", "lighting"],
//   dislikes: ["makeup", "fake"],
//   suggestions: [
//     "Focus on natural features",
//     "Use outdoor lighting"
//   ]
// }
```

### Prompt Enhancement

**Original:**
```
"beautiful girl on the beach"
```

**With insights:**
```javascript
const context = {
  insights: {
    likes: [
      {keyword: "natural", count: 25},
      {keyword: "smile", count: 20}
    ],
    dislikes: [
      {keyword: "fake", count: 10}
    ]
  }
};
```

**Enhanced:**
```
"A beautiful young woman with natural features and a genuine smile 
on a sunny beach. Natural lighting, realistic appearance, 
high quality photography. Avoid fake or artificial look."
```

---

## 🔐 Аутентифікація

### JWT Tokens
```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}
```

### Password Hashing
```javascript
const bcrypt = require('bcryptjs');

// Хешування при реєстрації
const passwordHash = await bcrypt.hash(password, 10);

// Перевірка при логіні
const isValid = await bcrypt.compare(password, user.password_hash);
```

---

## 🎨 Frontend Architecture

### Custom Hooks

#### `useSwipe`
```javascript
export function useSwipe(userId) {
  const [currentContent, setCurrentContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  
  const loadNextContent = async () => {
    const content = await api.getRandomContent(userId);
    setCurrentContent(content);
  };
  
  const handleSwipe = async (direction, comment) => {
    await api.createRating({
      contentId: currentContent.id,
      userId,
      direction,
      comment
    });
    
    setHistory([...history, currentContent]);
    loadNextContent();
  };
  
  return {
    currentContent,
    loading,
    history,
    handleSwipe,
    loadNextContent
  };
}
```

---

## 🚀 Deployment

### Environment Variables

#### Backend `.env`
```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# AI Services
REPLICATE_API_TOKEN=your_replicate_token
OPENAI_API_KEY=your_openai_key

# Authentication
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=production
```

#### Frontend `.env`
```env
REACT_APP_API_URL=https://your-api.com/api
REACT_APP_ENABLE_ANALYTICS=true
```

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/build/

# Backend
cd backend
npm start
# Runs on PORT from .env
```

---

## 🔧 Troubleshooting

### Database Issues

#### Перевірка структури
```bash
cd scripts
./verify_and_fix_db.sh
```

#### Ручна перевірка
```sql
-- Перевірити таблиці
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Перевірити колонки content
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content';
```

### API Issues

#### Backend логи
```bash
cd backend
npm run dev
# Дивіться консоль на помилки
```

#### Тестування endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Generate content
curl -X POST http://localhost:5000/api/content/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "test",
    "userId": "uuid",
    "mediaType": "image"
  }'
```

---

## 📊 Performance Optimization

### Database Indexes
```sql
-- Indexes для швидкого пошуку
CREATE INDEX idx_content_user_id ON content(user_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_content_id ON ratings(content_id);
CREATE INDEX idx_ai_learnings_user_rating ON ai_learnings(user_id, rating);
```

### Caching Strategy
```javascript
// Frontend: Cache user insights
const cachedInsights = localStorage.getItem('user_insights');
if (cachedInsights && !isExpired(cachedInsights)) {
  return JSON.parse(cachedInsights);
}
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📚 Додаткові ресурси

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Replicate API Docs](https://replicate.com/docs)
- [React Documentation](https://react.dev)

---

Made with ❤️ by SerhiiDubei
