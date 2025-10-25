# 🔥 Tinder AI Feedback Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

**Платформа для збору людського фідбеку через Tinder-подібний swipe інтерфейс для покращення AI моделей генерації контенту.**

An AI-powered platform that learns your preferences through Tinder-style swipes and generates personalized content based on your feedback.

---

## ✨ Ключові можливості

### 🎨 AI Генерація контенту
- **Image & Video Generation**: Висока якість через Replicate API
- **Smart Prompting**: GPT-4o покращує промпти з врахуванням вивченого контексту
- **Dating Focus**: Спеціалізація на dating контенті з реалістичними фото
- **Batch Generation**: До 50 промптів за раз з унікальними варіаціями

### 👆 Tinder-подібний інтерфейс
- **← Left**: Dislike (з опціональним коментарем)
- **→ Right**: Like
- **↑ Up**: Superlike (з обов'язковим коментарем)
- **↓ Down**: Skip/Reroll
- **Mobile-First Design**: Адаптивний UI для всіх пристроїв

### 🧠 Інтелектуальна система навчання
- **LLM-based Analysis**: GPT-4o-mini аналізує коментарі користувачів
- **Персональні профілі**: Кожен користувач має унікальний профіль переваг
- **Автоматична категоризація**: Dating/General/Professional
- **Continuous Learning**: Система постійно вдосконалюється

### 🔐 Аутентифікація та багатокористувацькість
- **User Authentication**: Реєстрація та логін
- **Admin Panel**: Перегляд всіх користувачів та контенту
- **User-based Generation**: Персоналізована генерація для кожного користувача

### 📊 Аналітика в реальному часі
- **Dashboard**: Загальна статистика (контент, свайпи, like rate)
- **Top Content**: Найкраще згенерований контент
- **Preference Insights**: Візуалізація переваг користувача

---

## 🚀 Швидкий старт

### Необхідні компоненти

- **Node.js** 18+ ([Завантажити](https://nodejs.org/))
- **npm** (постачається з Node.js)
- **Supabase Account** ([Зареєструватись](https://supabase.com/))
- **Replicate API Key** ([Отримати ключ](https://replicate.com/))
- **OpenAI API Key** ([Отримати ключ](https://platform.openai.com/))

### Встановлення

#### Крок 1: Клонувати репозиторій

```bash
git clone https://github.com/SerhiiDubei/Tin_UI_V2.git
cd Tin_UI_V2
```

#### Крок 2: Запустити інтерактивне налаштування

```bash
npm install
node scripts/setup.js
```

Скрипт запитає:
- Supabase URL
- Supabase Anon Key
- Replicate API Token
- OpenAI API Key

#### Крок 3: Налаштування бази даних

1. Відкрийте [Supabase Dashboard](https://supabase.com/dashboard)
2. Виберіть проект → SQL Editor
3. Скопіюйте вміст `database/migrations/001_initial_schema.sql`
4. Виконайте SQL міграцію
5. Перевірте створення таблиць

#### Крок 4: Встановити залежності

```bash
npm run install:all
```

#### Крок 5: Запустити сервери розробки

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📁 Структура проекту

```
Tin_UI_V2/
│
├── frontend/                    # React 18 Frontend
│   ├── src/
│   │   ├── components/          # UI компоненти
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Сторінки
│   │   └── services/            # API інтеграція
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   └── src/
│       ├── config/              # Конфігурація
│       ├── db/                  # Database connection
│       ├── services/            # Бізнес-логіка
│       └── routes/              # API endpoints
│
├── database/                    # Database schemas
│   └── migrations/
│
├── scripts/                     # Utility scripts
│   ├── setup.js                 # Інтерактивне налаштування
│   └── verify_and_fix_db.sh     # Верифікація БД
│
└── README.md                    # Ця документація
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling

### Backend
- **Node.js 18+** - Runtime
- **Express 4.21** - Web framework
- **Supabase** - PostgreSQL database
- **OpenAI API** - GPT-4o для покращення промптів
- **Replicate API** - Генерація зображень/відео

### AI/ML
- **OpenAI GPT-4o** - Prompt enhancement
- **OpenAI GPT-4o-mini** - Comment analysis
- **Replicate Models** - Image/video generation

---

## 🗄️ База даних

### Основні таблиці

#### `users`
Користувачі системи з ролями

#### `prompt_templates`
Шаблони промптів з навченими insights

#### `content`
Згенерований контент (зображення/відео)

#### `ratings`
Зворотній зв'язок користувачів (свайпи)

#### `user_insights`
Персональні профілі переваг

#### `ai_learnings`
Збережені промпти та відповіді для покращення системи

---

## 🎯 Як це працює

### 1. Генерація контенту

```
Запит користувача → Backend
           ↓
Отримання user insights + template
           ↓
GPT-4o покращує prompt з контекстом
           ↓
Replicate генерує зображення/відео
           ↓
Збереження в БД
           ↓
Повернення URL
```

### 2. Swipe & Навчання

```
Користувач робить swipe
           ↓
Запис: direction, comment, latency
           ↓
Створення rating в БД
           ↓
GPT-4o-mini аналізує коментарі
           ↓
Оновлення user_insights
           ↓
Наступна генерація використовує оновлені insights
```

### 3. AI Learning System

```
Промпт + Відповідь → ai_learnings таблиця
           ↓
Користувач оцінює (1-5 зірок)
           ↓
Система збирає найкращі приклади
           ↓
Використання для покращення майбутніх генерацій
```

---

## 🔧 API Endpoints

### Content
- `POST /api/content/generate` - Генерувати контент
- `POST /api/content/generate-batch` - Batch генерація
- `GET /api/content/:id` - Отримати контент
- `GET /api/content/random/next` - Випадковий контент

### Ratings
- `POST /api/ratings` - Створити rating
- `GET /api/ratings` - Список ratings
- `GET /api/ratings/stats` - Статистика користувача

### Insights
- `GET /api/insights/user/:userId` - User insights
- `POST /api/insights/user/:userId/update` - Оновити insights
- `GET /api/insights/dashboard` - Dashboard дані

### AI Learning
- `POST /api/learning/save` - Зберегти промпт/відповідь
- `POST /api/learning/:id/rate` - Оцінити (1-5 зірок)
- `GET /api/learning/best` - Найкращі приклади

---

## 📊 Система навчання AI

### Автоматичне збереження
Кожен промпт та відповідь автоматично зберігається в `ai_learnings`:
- Original prompt
- Enhanced prompt
- Category (Dating/General/Professional)
- User rating (1-5 зірок)
- Generation parameters

### База знань
Система накопичує найкращі приклади (рейтинг 4-5 зірок) та використовує їх для:
- Покращення майбутніх промптів
- Аналізу паттернів
- Персоналізації для користувача

### Детальніше
Повна документація: [TECHNICAL.md](./TECHNICAL.md)

---

## 🚀 Deployment

### Frontend (GitHub Pages)

1. Налаштуйте `homepage` в `package.json`:
   ```json
   "homepage": "https://SerhiiDubei.github.io/Tin_UI_V2"
   ```

2. Build і deploy:
   ```bash
   npm run build:frontend
   ```

### Backend (Railway / Render)

1. Підключіть GitHub repository
2. Встановіть environment variables
3. Deploy з директорії `backend/`

---

## 🐛 Troubleshooting

### Backend не запускається
- Перевірте `.env` файл
- Переконайтеся, що Supabase credentials правильні
- Запустіть `npm install` в `backend/`

### Frontend не підключається до API
- Перевірте, що backend запущений на порту 5000
- Перевірте `REACT_APP_API_URL` в `frontend/.env`

### Помилки бази даних
- Виконайте `scripts/verify_and_fix_db.sh`
- Перевірте міграції в Supabase Dashboard

---

## 📝 Документація

- **README.md** (цей файл) - Огляд та швидкий старт
- **TECHNICAL.md** - Технічна документація, API, архітектура
- **GUIDES.md** - Посібники по використанню та розробці

---

## 🤝 Contributing

Contributions are welcome! Дотримуйтесь правил:

1. Fork репозиторій
2. Створіть feature branch
3. Зробіть commit змін
4. Відкрийте Pull Request

---

## 📧 Контакти

**Project Link**: https://github.com/SerhiiDubei/Tin_UI_V2

**Issues**: https://github.com/SerhiiDubei/Tin_UI_V2/issues

---

## ✅ Статус проекту

**Last Updated**: October 25, 2025

**Status**: ✅ **PRODUCTION READY**

### Реалізовано:
- ✅ Повний frontend з React 18
- ✅ Повний backend API
- ✅ Аутентифікація та багатокористувацькість
- ✅ AI Learning System з рейтингами
- ✅ Batch генерація з унікальними промптами
- ✅ Dating-focused контент
- ✅ Admin Panel
- ✅ Database verification tools

---

Made with ❤️ by SerhiiDubei
