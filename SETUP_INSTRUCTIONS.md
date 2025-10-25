# 🚀 Інструкція по запуску проєкту з авторизацією

## ✅ Що було додано:

### 1. 🔐 Система авторизації
- Login page з quick buttons
- AuthContext для управління сесією
- Protected routes

### 2. 👤 User-based генерація
- Кожен юзер генерує свій контент
- Відображення "My Generated Content"
- user_id tracking в базі

### 3. 👑 Admin панель
- Перегляд всіх юзерів
- Перегляд всього контенту з user attribution
- Статистика по ratings
- 3 таби: Users, Content, Ratings

### 4. 🎯 Empty state handling
- Заглушка "No content yet" з кнопкою на Generate
- Proper error handling

---

## 📋 Кроки для запуску:

### Крок 1: Database Migration

1. Відкрий Supabase Dashboard: https://supabase.com/dashboard
2. Вибери свій проєкт
3. Перейди в **SQL Editor**
4. Скопіюй і виконай:

```sql
-- Файл: database/migrations/002_add_users_table.sql
```

Скопіюй **весь вміст** файлу `database/migrations/002_add_users_table.sql` і виконай в SQL Editor.

Це створить:
- ✅ Таблицю `users` (з admin та testuser)
- ✅ Додасть `user_id` колонку до `content`

### Крок 2: Backend (якщо ще не запущений)

```bash
cd C:\Users\HP OMEN\Desktop\Tin_UI_V2\backend
npm run dev
```

**Backend** запуститься на порту **5000**.

### Крок 3: Frontend (якщо ще не запущений)

```bash
cd C:\Users\HP OMEN\Desktop\Tin_UI_V2\frontend
npm start
```

**Frontend** запуститься на порту **3000**.

---

## 🎭 Тестові акаунти:

### Admin:
- **Username**: `admin`
- **Password**: `admin123`
- **Доступ**: Всі сторінки + Admin Panel

### Regular User:
- **Username**: `testuser`
- **Password**: `test123`
- **Доступ**: Generate, Swipe, Dashboard, Settings

---

## 🔄 Новий flow роботи:

### 1. **Авторизація** (http://localhost:3000/login)
- Можна ввести вручну або натиснути "Login as Admin" / "Login as User"
- Після логіну автоматично перекидає на відповідну сторінку

### 2. **Generate Page** (http://localhost:3000/generate)
- **Тільки для залогінених юзерів**
- Кожен юзер генерує свій контент
- Контент прив'язується до `user_id`
- Відображається галерея "My Generated Content"

### 3. **Swipe Page** (http://localhost:3000/swipe)
- Якщо немає контенту - показує заглушку з кнопкою "Go to Generate Page"
- Юзер свайпить контент (свій та інших)
- Ratings зберігаються з `user_id`

### 4. **Dashboard** (http://localhost:3000/dashboard)
- Статистика юзера
- User insights (likes/dislikes/suggestions)
- Top content

### 5. **Admin Panel** (http://localhost:3000/admin) - **ТІЛЬКИ ДЛЯ ADMIN**
- **Tab Users**: список всіх юзерів з статистикою
- **Tab Content**: весь згенерований контент з user attribution
- **Tab Ratings**: всі ratings з коментарями

### 6. **Settings** (http://localhost:3000/settings)
- User profile info
- Export data
- Reset insights (в розробці)

---

## 📊 База даних:

### Нові таблиці:

#### `users`
```sql
- id (UUID)
- username (TEXT, UNIQUE)
- email (TEXT, UNIQUE)
- password_hash (TEXT) -- для demo використовує прості паролі
- full_name (TEXT)
- role (TEXT) -- 'user' або 'admin'
- is_active (BOOLEAN)
- created_at, updated_at, last_login_at (TIMESTAMP)
```

#### Оновлена `content`
```sql
-- Додана колонка:
- user_id (UUID) REFERENCES users(id)
```

---

## 🔍 Як тестувати:

### Тест 1: User Flow
1. Залогінься як **testuser** (test123)
2. Перейди на **Generate** → введи prompt → згенеруй контент
3. Перейди на **Swipe** → свайпай згенерований контент
4. Перейди на **Dashboard** → подивись статистику
5. Logout

### Тест 2: Admin Flow
1. Залогінься як **admin** (admin123)
2. Перейди на **Admin** → Tab Users → подивись testuser статистику
3. Tab Content → подивись контент testuser'а
4. Tab Ratings → подивись ratings
5. Перейди на **Generate** → згенеруй контент як admin
6. Logout

### Тест 3: Multiple Users
1. Залогінься як testuser → згенеруй 3 items
2. Logout
3. Залогінься як admin → згенеруй 3 items
4. Перейди на Admin → подивись що кожен юзер має свій контент
5. Logout
6. Залогінься як testuser → свайпай всі 6 items
7. Dashboard → подивись insights

---

## 🐛 Troubleshooting:

### Помилка: "users table does not exist"
**Рішення**: Виконай міграцію `002_add_users_table.sql` в Supabase

### Помилка: "Login failed" або 401
**Рішення**: 
- Перевір чи виконана міграція
- Перевір чи існують записи в таблиці `users`

### Помилка: "Cannot read property 'id' of undefined"
**Рішення**: Logout і залогінься знову

### Admin Panel порожній
**Рішення**: 
- Згенеруй контент як user
- Зроби кілька swipes
- Перезавантаж Admin Page

---

## 📝 API Endpoints:

### Auth:
- `POST /api/auth/login` - логін
- `POST /api/auth/register` - реєстрація (для майбутнього)

### Admin:
- `GET /api/admin/users` - список всіх юзерів
- `GET /api/admin/stats` - загальна статистика

### Content (оновлено):
- `POST /api/content/generate` - тепер приймає `userId` в body
- `GET /api/content?userId=...` - фільтр по юзеру

---

## ⚠️ Важливо:

1. **Міграція обов'язкова**: Без `002_add_users_table.sql` нічого не працюватиме
2. **user_id tracking**: Весь контент тепер прив'язаний до юзера
3. **Protected routes**: Без логіну не потрапиш на Generate/Swipe/Dashboard
4. **Admin access**: Тільки admin бачить Admin Panel
5. **Simple auth**: Це demo версія, паролі НЕ захешовані (для production треба bcrypt)

---

## 🎯 Що далі (опціонально):

- [ ] Додати bcrypt для real password hashing
- [ ] Додати "Reset password" функціонал
- [ ] Додати email verification
- [ ] Додати admin функції: ban user, delete content
- [ ] Додати user roles: moderator, premium, etc.
- [ ] Додати profile page з avatar upload

---

## 🔗 Корисні лінки:

- **GitHub**: https://github.com/SerhiiDubei/Tin_UI_V2
- **Supabase**: https://supabase.com/dashboard
- **Local Backend**: http://localhost:5000/api/health
- **Local Frontend**: http://localhost:3000

---

**Гарного тестування! 🚀**
