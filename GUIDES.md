# 📘 Посібники по використанню та розробці

## 📖 Зміст

1. [Для користувачів](#для-користувачів)
2. [Для розробників](#для-розробників)
3. [Для адміністраторів](#для-адміністраторів)
4. [GitHub Pages Setup](#github-pages-setup)
5. [FAQ](#faq)

---

## 👤 Для користувачів

### Перше використання

#### 1. Реєстрація
1. Відкрийте застосунок
2. Натисніть "Sign Up"
3. Введіть email, username, password
4. Підтвердіть реєстрацію

#### 2. Генерація контенту
1. Перейдіть на головну сторінку
2. Введіть промпт (наприклад: "beautiful girl on the beach")
3. Натисніть "Generate"
4. Зачекайте ~10 секунд

#### 3. Swipe інтерфейс
- **← Swipe Left**: Не подобається (можна додати коментар)
- **→ Swipe Right**: Подобається
- **↑ Swipe Up**: Дуже подобається (обов'язковий коментар)
- **↓ Swipe Down**: Пропустити

#### 4. Коментарі
**Коли додавати:**
- Left swipe: опціонально (що саме не подобається)
- Up swipe: обов'язково (що саме подобається)

**Приклади хороших коментарів:**
- "Мені подобається натуральна усмішка"
- "Занадто темне фото, погане освітлення"
- "Природній вигляд, реалістичне фото"
- "Дуже штучно виглядає, забагато макіяжу"

#### 5. Dashboard
**Що можна побачити:**
- Загальна статистика (скільки свайпів, like rate)
- Топ контент (найкращі згенеровані фото)
- Ваші переваги (що вам подобається)

**Як оновити insights:**
- Натисніть "Refresh Insights"
- Система проаналізує останні 50 свайпів
- Нові преференції будуть використані при генерації

---

### Batch Generation

#### Що це?
Генерація багатьох варіацій одного промпту за раз (до 50 штук).

#### Як використовувати:
1. Перейдіть на сторінку генерації
2. Введіть базовий промпт: "beautiful dating profile photo"
3. Виберіть кількість: 10-50
4. Натисніть "Generate Batch"
5. Зачекайте ~2-5 хвилин

#### Що відбувається:
```
Базовий промпт: "beautiful dating profile photo"
         ↓
Система створює 10 унікальних варіацій:
1. "beautiful blonde girl with natural smile..."
2. "beautiful brunette in casual outdoor setting..."
3. "beautiful girl with warm expression in sunlight..."
...
10. "beautiful woman with genuine smile, natural makeup..."
```

**Кожна варіація унікальна!**

---

### AI Learning System

#### Як це працює?

**Крок 1: Ви генерує контент**
```
Prompt: "beautiful girl" → AI генерує фото
```

**Крок 2: Система зберігає промпт**
```
ai_learnings таблиця:
- original_prompt: "beautiful girl"
- enhanced_prompt: "A beautiful young woman..."
- response_data: {url, model, params}
```

**Крок 3: Ви оцінюєте (1-5 зірок)**
```
1 ⭐ - Дуже погано
2 ⭐⭐ - Погано
3 ⭐⭐⭐ - Нормально
4 ⭐⭐⭐⭐ - Добре
5 ⭐⭐⭐⭐⭐ - Відмінно
```

**Крок 4: Система вчиться**
```
Найкращі промпти (rating >= 4) 
→ Аналіз паттернів
→ Покращення майбутніх генерацій
```

#### Де оцінити?
- Dashboard → "AI Learnings" секція
- Кожен згенерований контент можна оцінити
- Оцінки зберігаються назавжди

---

## 💻 Для розробників

### Налаштування середовища

#### 1. Клонування та встановлення
```bash
git clone https://github.com/SerhiiDubei/Tin_UI_V2.git
cd Tin_UI_V2

# Встановити залежності
npm install
npm run install:all

# Налаштувати .env
node scripts/setup.js
```

#### 2. Запуск в development mode
```bash
# Одночасно frontend + backend
npm run dev

# Окремо frontend
npm run dev:frontend

# Окремо backend
npm run dev:backend
```

---

### Додавання нових features

#### 1. Новий API endpoint

**backend/src/routes/custom.routes.js:**
```javascript
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/my-endpoint', authenticateToken, async (req, res) => {
  try {
    const { param1, param2 } = req.body;
    const userId = req.user.id;
    
    // Ваша логіка
    const result = await yourFunction(param1, param2, userId);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**backend/src/routes/index.js:**
```javascript
import customRoutes from './custom.routes.js';

router.use('/custom', customRoutes);
```

#### 2. Нова сторінка в React

**frontend/src/pages/MyPage.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MyPage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const response = await api.get('/custom/my-endpoint');
      setData(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  return (
    <div className="my-page">
      <h1>My Custom Page</h1>
      {/* Ваш UI */}
    </div>
  );
}

export default MyPage;
```

**frontend/src/App.jsx:**
```javascript
import MyPage from './pages/MyPage';

<Route path="/my-page" element={<MyPage />} />
```

---

### Робота з базою даних

#### Додавання нової таблиці
```sql
-- database/migrations/002_add_new_table.sql
CREATE TABLE my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_my_table_user_id ON my_table(user_id);
```

**Застосувати міграцію:**
1. Supabase Dashboard → SQL Editor
2. Paste SQL
3. Run

#### Запити до бази
```javascript
// backend/src/services/myservice.js
import { supabase } from '../db/supabase.js';

export async function getMyData(userId) {
  const { data, error } = await supabase
    .from('my_table')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}
```

---

### Додавання нового AI сервісу

```javascript
// backend/src/services/myai.service.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeText(text) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant.'
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0.7
  });
  
  return response.choices[0].message.content;
}
```

---

### Testing

#### Backend Unit Tests
```javascript
// backend/src/services/__tests__/myservice.test.js
import { getMyData } from '../myservice.js';

describe('My Service', () => {
  test('should fetch user data', async () => {
    const userId = 'test-uuid';
    const data = await getMyData(userId);
    
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

```bash
cd backend
npm test
```

#### Frontend Component Tests
```javascript
// frontend/src/components/__tests__/MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  const element = screen.getByText(/My Component/i);
  expect(element).toBeInTheDocument();
});
```

```bash
cd frontend
npm test
```

---

## 👨‍💼 Для адміністраторів

### Admin Panel

#### Доступ
1. Логін з admin акаунтом (role = 'admin')
2. Перейти на `/admin`

#### Можливості

**1. Users Management**
- Перегляд всіх користувачів
- Email, username, дата реєстрації
- Кількість згенерованого контенту
- Останній логін

**2. Content Overview**
- Весь згенерований контент
- Хто згенерував
- Кількість likes/dislikes
- Top performing content

**3. Ratings/Feedback**
- Всі свайпи всіх користувачів
- Коментарі користувачів
- Статистика по контенту

**4. AI Learnings**
- Найкращі промпти (rating 4-5)
- Паттерни використання
- Популярні категорії

---

### Як додати адміна

#### Через Supabase Dashboard
```sql
-- SQL Editor
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

#### Через backend API (якщо ви вже адмін)
```javascript
// POST /api/admin/users/:userId/promote
await api.post(`/admin/users/${userId}/promote`, {
  role: 'admin'
});
```

---

### Моніторинг системи

#### Статистика
```sql
-- Загальна статистика
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM content) as total_content,
  (SELECT COUNT(*) FROM ratings) as total_ratings,
  (SELECT AVG(rating) FROM ai_learnings WHERE rating IS NOT NULL) as avg_ai_rating;
```

#### Top Users
```sql
SELECT 
  u.username,
  COUNT(c.id) as generated_content,
  COUNT(r.id) as total_swipes
FROM users u
LEFT JOIN content c ON u.id = c.user_id
LEFT JOIN ratings r ON u.id = r.user_id
GROUP BY u.id, u.username
ORDER BY generated_content DESC
LIMIT 10;
```

#### Best Content
```sql
SELECT 
  c.id,
  c.original_prompt,
  c.likes_count,
  c.avg_rating,
  u.username
FROM content c
JOIN users u ON c.user_id = u.id
ORDER BY c.avg_rating DESC, c.likes_count DESC
LIMIT 10;
```

---

## 🌐 GitHub Pages Setup

### Налаштування

#### 1. Build застосунку
```bash
cd frontend
npm run build
```

#### 2. Створити `index.html` в корені

**Файл для redirect на GitHub Pages:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0; url=./frontend/build/index.html">
  <title>Tinder AI Feedback Platform</title>
</head>
<body>
  <script>
    window.location.href = './frontend/build/index.html';
  </script>
</body>
</html>
```

#### 3. Налаштувати GitHub Pages
1. GitHub Repository → Settings
2. Pages → Source: "main" branch
3. Folder: "/ (root)"
4. Save

#### 4. Доступ
```
https://SerhiiDubei.github.io/Tin_UI_V2/
```

---

### Custom Domain (опціонально)

#### 1. Додати CNAME файл
```bash
echo "your-domain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

#### 2. Налаштувати DNS
```
Type: CNAME
Name: www
Value: SerhiiDubei.github.io
```

#### 3. Enable HTTPS
GitHub Pages → Settings → Enforce HTTPS ✓

---

## ❓ FAQ

### Загальні питання

**Q: Скільки коштує використання?**
A: Безкоштовно для розробки. Production: ~$0.01-0.10 за генерацію залежно від моделі.

**Q: Скільки часу займає генерація?**
A: ~10-30 секунд для зображення, ~2-5 хвилин для відео.

**Q: Чи можна змінити модель генерації?**
A: Так, в коді (`backend/src/services/replicate.service.js`) змініть model.

**Q: Скільки insights потрібно для персоналізації?**
A: ~10-20 свайпів для базової, ~50+ для детальної персоналізації.

---

### Технічні питання

**Q: Як додати нову таблицю в БД?**
A: Створіть міграцію SQL → Supabase Dashboard → SQL Editor → Run.

**Q: Як змінити JWT secret?**
A: `.env` → `JWT_SECRET=your_new_secret` → Restart backend.

**Q: Як додати нову модель Replicate?**
A: `backend/src/services/replicate.service.js` → Update model name.

**Q: Як перевірити структуру БД?**
A: Запустіть `scripts/verify_and_fix_db.sh`.

---

### Проблеми та рішення

**Q: Backend не може з'єднатися з БД**
A: Перевірте SUPABASE_URL та SUPABASE_KEY в `.env`.

**Q: Frontend показує 404 для API**
A: Перевірте REACT_APP_API_URL в `frontend/.env`.

**Q: Генерація не працює**
A: Перевірте REPLICATE_API_TOKEN та OPENAI_API_KEY.

**Q: Не зберігаються ratings**
A: Перевірте таблицю `ratings` (можливо missing UNIQUE constraint).

---

## 📚 Корисні команди

### Git
```bash
# Commit всіх змін
git add .
git commit -m "feat: add new feature"
git push origin main

# Створити нову гілку
git checkout -b feature/my-feature
git push -u origin feature/my-feature
```

### npm
```bash
# Оновити залежності
npm update

# Перевірити застарілі пакети
npm outdated

# Очистити cache
npm cache clean --force
```

### Database
```bash
# Backup БД (через Supabase Dashboard)
Dashboard → Database → Backups → Create backup

# Restore
Dashboard → Database → Backups → Restore
```

---

## 🎓 Навчальні ресурси

### React
- [Official React Docs](https://react.dev)
- [React Router](https://reactrouter.com)

### Node.js / Express
- [Express Documentation](https://expressjs.com)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

### AI Services
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Replicate Docs](https://replicate.com/docs)

---

## 📞 Підтримка

**GitHub Issues**: [Create Issue](https://github.com/SerhiiDubei/Tin_UI_V2/issues)

**Email**: support@example.com (замініть на ваш)

**Discord**: [Join Server](#) (якщо є)

---

Made with ❤️ by SerhiiDubei
