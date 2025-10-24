# ✅ База даних готова до налаштування!

## 🔑 Твої облікові дані Supabase

**Project URL:**
```
https://zllrhtvxdxzkixwbuqyv.supabase.co
```

**API Key (anon/public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJodHZ4ZHh6a2l4d2J1cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDgxNzQsImV4cCI6MjA3Njg4NDE3NH0.xgJ-nkvUTQ5YU_xF-yOkeBVoPbUsXAnRbGEOF5kMrOU
```

✅ **З'єднання перевірено і працює!**

---

## 🚀 Швидкий старт (3 кроки)

### Крок 1: Запусти SQL міграцію (1 хвилина)

1. **Відкрий SQL Editor у Supabase:**
   
   👉 https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/editor

2. **Натисни** "New query"

3. **Скопіюй увесь SQL** з файлу:
   ```
   database/migrations/001_initial_schema.sql
   ```

4. **Вставь у SQL Editor** і натисни **"Run"**

5. **Перевір результат:**
   - Має з'явитись: "Database setup completed successfully! ✅"
   - Має бути створено: "1 prompt templates created"

### Крок 2: Перевір таблиці (30 секунд)

1. **Відкрий Table Editor:**
   
   👉 https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/editor

2. **Переконайся що є 4 таблиці:**
   - ✅ `prompt_templates` (1 рядок)
   - ✅ `content` (пусто)
   - ✅ `ratings` (пусто)
   - ✅ `user_insights` (пусто)

### Крок 3: Запусти проєкт (1 команда)

```bash
cd /home/user/webapp/new-project
npm run dev
```

Відкрий браузер:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## ✅ Що вже налаштовано

- ✅ **Supabase URL** → backend/.env
- ✅ **API Key** → backend/.env
- ✅ **Frontend config** → frontend/.env
- ✅ **З'єднання протестовано** → працює!

**Залишилось тільки:**
- Запустити SQL міграцію (крок 1 вище)
- Отримати Replicate API token (для генерації зображень)
- Отримати OpenAI API key (для аналізу)

---

## 🔗 Корисні посилання

**Supabase Dashboard:**
- 🏠 Project Home: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv
- 💾 Table Editor: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/editor
- 📝 SQL Editor: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/sql
- 📊 Database: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/database/tables

**API Keys:**
- 🔑 Settings → API: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/settings/api

---

## 🧪 Тест з'єднання

```bash
# Тест 1: Перевірка API
curl "https://zllrhtvxdxzkixwbuqyv.supabase.co/rest/v1/" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJodHZ4ZHh6a2l4d2J1cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDgxNzQsImV4cCI6MjA3Njg4NDE3NH0.xgJ-nkvUTQ5YU_xF-yOkeBVoPbUsXAnRbGEOF5kMrOU"

# Тест 2: Backend health check (після запуску npm run dev)
curl http://localhost:5000/api/health
```

---

## 🎯 Наступні кроки

1. ✅ **База даних:** Запусти SQL міграцію (див. Крок 1)
2. 🔑 **API Keys:** Отримай Replicate + OpenAI ключі
3. 🚀 **Запуск:** `npm run dev`
4. 🎮 **Тестуй:** Генеруй контент і свайпай!

---

## 📚 Документація

- **Повна документація:** `README.md`
- **Швидкий старт:** `QUICKSTART.md`
- **Supabase гайд:** `SUPABASE_SETUP.md`
- **База даних:** `database/README.md`
- **Огляд проєкту:** `PROJECT_SUMMARY.md`

---

## 🔒 Безпека

⚠️ **ВАЖЛИВО:**
- ✅ **anon key** (зараз використовується) - БЕЗПЕЧНО для frontend
- ❌ **service_role key** - НЕ ВИКОРИСТОВУЙ у frontend!
- 🔐 Файл `.env` в `.gitignore` - ключі не попадуть у Git

---

**Готово до роботи!** 🎉

Якщо виникли проблеми - дивись секцію Troubleshooting у `QUICKSTART.md`
