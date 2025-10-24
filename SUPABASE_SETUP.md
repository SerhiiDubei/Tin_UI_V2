# 🗄️ Supabase Database Setup Guide

## Крок 1: Створення Supabase проєкту

1. **Перейди на** https://supabase.com/
2. **Натисни** "Start your project" або "Sign In"
3. **Залогінься** через GitHub / Email
4. **Натисни** "New Project"

---

## Крок 2: Налаштування проєкту

Заповни форму:

- **Name**: `tinder-ai-feedback` (або своє ім'я)
- **Database Password**: Створи надійний пароль (ЗБЕРЕЖИ ЙОГО!)
- **Region**: Вибери найближчий регіон (наприклад, `Europe (Frankfurt)` для України)
- **Pricing Plan**: `Free` (0$/місяць)

**Натисни** "Create new project"

⏳ Зачекай 1-2 хвилини поки проєкт створюється...

---

## Крок 3: Отримання API ключів

Після створення проєкту:

1. **Перейди на** Settings → API
2. **Скопіюй ці значення:**

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### API Keys
```
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **НЕ ПЛУТАЙ З service_role key** - вона має більше прав і не повинна використовуватись у frontend!

---

## Крок 4: Налаштування змінних середовища

Тепер давай використаємо ці ключі:

### Варіант А: Автоматично (рекомендовано)

```bash
cd /home/user/webapp/new-project
node scripts/setup.js
```

Скрипт запитає у тебе:
- Supabase URL
- Supabase Anon Key  
- Replicate API Token
- OpenAI API Key

### Варіант Б: Вручну

Створи файл `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REPLICATE_API_TOKEN=r8_xxxxx
OPENAI_API_KEY=sk-xxxxx
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
```

Створи файл `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEFAULT_USER_ID=demo-user-123
```

---

## Крок 5: Запуск SQL міграції

Тепер створимо таблиці в базі даних:

### 5.1 Відкрий SQL Editor

1. **Перейди на** Supabase Dashboard
2. **Вибери** свій проєкт `tinder-ai-feedback`
3. **Натисни** "SQL Editor" (ліва панель, іконка `</>`
4. **Натисни** "New query"

### 5.2 Скопіюй SQL міграцію

Відкрий файл:
```
/home/user/webapp/new-project/database/migrations/001_initial_schema.sql
```

Або скопіюй прямо звідси:

<details>
<summary>📄 Натисни щоб розгорнути SQL (213 рядків)</summary>

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS user_insights CASCADE;
DROP TABLE IF EXISTS prompt_templates CASCADE;

-- ============================================
-- TABLE: prompt_templates
-- Stores AI prompt templates with learned insights
-- ============================================
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    base_prompt TEXT NOT NULL,
    system_instructions TEXT,
    
    -- Learned insights (JSONB arrays of strings)
    likes JSONB DEFAULT '[]'::jsonb,
    dislikes JSONB DEFAULT '[]'::jsonb,
    suggestions JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: content
-- Generated content items (images/videos)
-- ============================================
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
    
    original_prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    generation_params JSONB DEFAULT '{}'::jsonb,
    
    -- Statistics (auto-updated by triggers)
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    superlike_count INTEGER DEFAULT 0,
    reroll_count INTEGER DEFAULT 0,
    avg_rating FLOAT DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: ratings
-- User feedback on content
-- ============================================
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    
    -- Swipe direction: 'left', 'right', 'up', 'down'
    direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'up', 'down')),
    comment TEXT,
    latency_ms INTEGER,
    user_weight FLOAT DEFAULT 1.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate ratings
    UNIQUE(content_id, user_id)
);

-- ============================================
-- TABLE: user_insights
-- Personal preference profiles per user
-- ============================================
CREATE TABLE user_insights (
    user_id UUID PRIMARY KEY,
    
    -- Extracted insights (JSONB arrays of strings)
    likes JSONB DEFAULT '[]'::jsonb,
    dislikes JSONB DEFAULT '[]'::jsonb,
    suggestions JSONB DEFAULT '[]'::jsonb,
    
    -- Statistics
    total_swipes INTEGER DEFAULT 0,
    like_rate FLOAT DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_content_id ON ratings(content_id);
CREATE INDEX idx_content_template_id ON content(template_id);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Update timestamp on prompt_templates
-- ============================================
CREATE TRIGGER update_prompt_templates_updated_at
    BEFORE UPDATE ON prompt_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-update content statistics
-- ============================================
CREATE OR REPLACE FUNCTION update_content_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE content
    SET
        like_count = (
            SELECT COUNT(*) FROM ratings 
            WHERE content_id = NEW.content_id AND direction = 'right'
        ),
        dislike_count = (
            SELECT COUNT(*) FROM ratings 
            WHERE content_id = NEW.content_id AND direction = 'left'
        ),
        superlike_count = (
            SELECT COUNT(*) FROM ratings 
            WHERE content_id = NEW.content_id AND direction = 'up'
        ),
        reroll_count = (
            SELECT COUNT(*) FROM ratings 
            WHERE content_id = NEW.content_id AND direction = 'down'
        ),
        total_ratings = (
            SELECT COUNT(*) FROM ratings 
            WHERE content_id = NEW.content_id
        ),
        avg_rating = (
            SELECT AVG(
                CASE 
                    WHEN direction = 'right' THEN 1.0
                    WHEN direction = 'left' THEN -1.0
                    WHEN direction = 'up' THEN 2.0
                    ELSE 0.0
                END
            )
            FROM ratings
            WHERE content_id = NEW.content_id
        )
    WHERE id = NEW.content_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Update content stats on new rating
-- ============================================
CREATE TRIGGER update_content_stats_on_rating
    AFTER INSERT OR UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_content_stats();

-- ============================================
-- SEED DATA: Default template
-- ============================================
INSERT INTO prompt_templates (name, description, base_prompt, system_instructions, likes, dislikes, suggestions)
VALUES (
    'dating_photos_v1',
    'Default template for dating profile photos',
    'A high-quality dating profile photo',
    'Generate attractive, professional-looking photos suitable for dating profiles. Focus on good lighting, flattering angles, and natural expressions.',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Database setup completed successfully! ✅' AS status;
SELECT COUNT(*) || ' prompt templates created' AS templates FROM prompt_templates;
```

</details>

### 5.3 Запусти SQL

1. **Вставь весь SQL** у SQL Editor
2. **Натисни** "Run" (або Ctrl+Enter)
3. **Дочекайся** повідомлення про успіх

Ти побачиш:
```
✅ Database setup completed successfully!
1 prompt templates created
```

---

## Крок 6: Перевірка таблиць

1. **Перейди на** "Table Editor" (ліва панель)
2. **Переконайся що створені 4 таблиці:**

- ✅ `prompt_templates` (1 row - dating_photos_v1)
- ✅ `content` (0 rows - порожня)
- ✅ `ratings` (0 rows - порожня)
- ✅ `user_insights` (0 rows - порожня)

---

## Крок 7: Тестування з'єднання

Тепер перевіримо чи все працює:

```bash
cd /home/user/webapp/new-project/backend
npm run dev
```

У логах має бути:
```
✓ Connected to Supabase
Server running on port 5000
```

Тест API:
```bash
curl http://localhost:5000/api/health
```

Очікувана відповідь:
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T13:30:00.000Z",
  "database": "connected"
}
```

---

## 🎉 Готово!

Твоя база даних налаштована і готова до використання!

**Що далі:**
1. Запусти backend: `npm run dev:backend`
2. Запусти frontend: `npm run dev:frontend`
3. Відкрий http://localhost:3000
4. Почни генерувати контент і свайпати!

---

## 🔒 Безпека (Production)

Для продакшн потрібно налаштувати Row Level Security (RLS):

```sql
-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users view own ratings"
  ON ratings FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users insert own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);
```

**Але для розробки це не обов'язково!**

---

## ❓ Troubleshooting

### Помилка: "relation does not exist"
**Рішення:** SQL міграція не виконалась. Запусти знову у SQL Editor.

### Помилка: "Connection refused"
**Рішення:** Перевір SUPABASE_URL та SUPABASE_KEY у backend/.env

### Помилка: "Invalid API key"
**Рішення:** Переконайся що використовуєш **anon key**, а не service_role key

---

**Питання? Дивись:** `database/README.md` для детальної документації!
