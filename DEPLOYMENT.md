# 🚀 Deployment Guide

Цей проект складається з двох частин:
- **Frontend** (React) → GitHub Pages
- **Backend** (Express API) → Vercel

---

## 📦 Backend Deployment (Vercel)

### Крок 1: Підготовка

1. Зареєструйтесь на [Vercel](https://vercel.com) (можна через GitHub)
2. Встановіть Vercel CLI (опціонально):
   ```bash
   npm install -g vercel
   ```

### Крок 2: Deploy через Vercel Dashboard

1. **Відкрийте** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Натисніть** "Add New" → "Project"
3. **Імпортуйте** GitHub репозиторій: `SerhiiDubei/Tin_UI_V2`
4. **Налаштуйте проект**:
   ```
   Framework Preset: Other
   Root Directory: backend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: npm install
   ```

5. **Додайте Environment Variables**:
   ```
   SUPABASE_URL=https://kqtdchkvzwwthtmamxlz.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   REPLICATE_API_TOKEN=your_replicate_token
   OPENAI_API_KEY=your_openai_key
   NODE_ENV=production
   CORS_ORIGINS=https://serhiidubei.github.io
   ```

6. **Deploy!** Натисніть "Deploy"

### Крок 3: Отримати URL

Після deployment ви отримаєте URL типу:
```
https://tin-ui-backend-xxx.vercel.app
```

Збережіть цей URL - він буде потрібен для frontend!

---

## 🌐 Frontend Deployment (GitHub Pages)

### Крок 1: Оновити API URL

Відредагуйте `frontend/.env.production`:
```env
REACT_APP_API_URL=https://tin-ui-backend-xxx.vercel.app/api
```

### Крок 2: Build Frontend

```bash
cd frontend
npm run build
```

### Крок 3: Deploy на GitHub Pages

**Варіант А: Через GitHub Dashboard**

1. Перейдіть на https://github.com/SerhiiDubei/Tin_UI_V2/settings/pages
2. Виберіть:
   - Source: `main` branch
   - Folder: `/ (root)`
3. Save
4. Зачекайте ~2 хвилини
5. Сайт буде на: https://serhiidubei.github.io/Tin_UI_V2/

**Варіант Б: Через gh-pages package**

```bash
# Встановіть gh-pages
npm install --save-dev gh-pages

# Додайте в frontend/package.json:
{
  "homepage": "https://serhiidubei.github.io/Tin_UI_V2",
  "scripts": {
    "deploy": "gh-pages -d build"
  }
}

# Deploy
npm run deploy
```

---

## 🔧 Налаштування CORS

Після deployment оновіть CORS на Vercel:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Знайдіть `CORS_ORIGINS`
3. Додайте ваш GitHub Pages URL:
   ```
   https://serhiidubei.github.io
   ```

---

## ✅ Перевірка

1. **Backend Health Check**:
   ```
   https://tin-ui-backend-xxx.vercel.app/api/health
   ```
   Має повернути: `{"status":"ok"}`

2. **Frontend**:
   ```
   https://serhiidubei.github.io/Tin_UI_V2/
   ```
   Має відкритись застосунок

---

## 🐛 Troubleshooting

### Backend не працює

- Перевірте логи у Vercel Dashboard → Project → Deployments → Latest → View Logs
- Перевірте Environment Variables
- Переконайтесь, що всі залежності в `package.json`

### Frontend не підключається до Backend

- Перевірте CORS налаштування
- Перевірте `REACT_APP_API_URL` в build
- Відкрийте Console в браузері (F12) для помилок

### "Failed to fetch" помилки

- Перевірте що backend працює (health check)
- Перевірте що URL правильний
- Перевірте CORS origins

---

## 📊 Моніторинг

### Vercel Analytics

Vercel автоматично надає:
- Request logs
- Function invocations
- Response times
- Error tracking

Доступ: Vercel Dashboard → Project → Analytics

### GitHub Pages Status

Статус deployment:
- https://github.com/SerhiiDubei/Tin_UI_V2/deployments

---

## 🔄 CI/CD (Auto-deployment)

### Backend (Vercel)

✅ Вже налаштовано! Кожен push в `main` автоматично деплоїться на Vercel.

### Frontend (GitHub Pages)

**Варіант 1: GitHub Actions**

Створіть `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm install
      
      - name: Build
        run: cd frontend && npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
```

**Варіант 2: Manual deployment**

```bash
cd frontend
npm run build
npm run deploy  # якщо є gh-pages script
```

---

## 💰 Pricing

### Vercel Free Tier

- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ⚠️ Function execution: 100 GB-hours/month

### GitHub Pages

- ✅ 100% безкоштовно для public repos
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Custom domains

---

## 📝 Додаткові ресурси

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

Made with ❤️ by SerhiiDubei
