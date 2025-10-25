# 🌐 Налаштування GitHub Pages

## Автоматичний Deploy Фронтенду

Я створив GitHub Actions workflow, який автоматично деплоїть ваш фронтенд на GitHub Pages при кожному push в `main` гілку.

## 📋 Інструкції для активації:

### Крок 1: Увімкніть GitHub Pages
1. Перейдіть на https://github.com/SerhiiDubei/Tin_UI_V2/settings/pages
2. В розділі **"Source"** виберіть:
   - Source: **GitHub Actions**
3. Збережіть зміни

### Крок 2: Налаштуйте Backend URL (опціонально)
Якщо ваш бекенд розміщений окремо:
1. Перейдіть на https://github.com/SerhiiDubei/Tin_UI_V2/settings/secrets/actions
2. Натисніть **"New repository secret"**
3. Створіть секрет:
   - Name: `REACT_APP_API_URL`
   - Value: URL вашого бекенду (наприклад: `https://your-backend.com/api`)

### Крок 3: Запустіть Deploy
Після того як ви закомітите та запушите зміни:
```bash
git add .
git commit -m "feat: Setup GitHub Pages deployment"
git push origin main
```

GitHub Actions автоматично:
1. ✅ Встановить залежності
2. ✅ Збудує фронтенд
3. ✅ Задеплоїть на GitHub Pages

### Крок 4: Перевірте Deploy
1. Перейдіть на https://github.com/SerhiiDubei/Tin_UI_V2/actions
2. Зачекайте, поки workflow завершиться (зелена галочка ✅)
3. Ваш сайт буде доступний за адресою:
   - https://serhiidubei.github.io/Tin_UI_V2/

## 🔧 Структура проекту

```
Tin_UI_V2/
├── frontend/          # React додаток
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/           # Node.js API (деплоїть окремо)
│   └── src/
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions для deploy
└── README.md
```

## ⚠️ Важливо

1. **Backend окремо**: GitHub Pages підтримує тільки статичні сайти (фронтенд). 
   Бекенд треба розмістити на іншому хостингу (Heroku, Railway, Render, тощо).

2. **CORS налаштування**: Не забудьте додати URL GitHub Pages в CORS origins бекенду:
   ```javascript
   CORS_ORIGINS=https://serhiidubei.github.io
   ```

3. **Environment змінні**: Всі чутливі дані (API keys) мають бути в GitHub Secrets, не в коді!

## 🚀 Альтернативні варіанти деплою:

### Варіант 1: Повний деплой на одному хостингу
- **Vercel** - Підтримує і фронтенд, і serverless functions
- **Netlify** - Теж підтримує обидва
- **Railway** - Підтримує повний стек

### Варіант 2: Розділений деплой
- **Frontend**: GitHub Pages (безкоштовно)
- **Backend**: 
  - Railway (безкоштовно до певного ліміту)
  - Render (безкоштовно з обмеженнями)
  - Fly.io (безкоштовно)

## 📝 Наступні кроки:

1. ✅ Увімкніть GitHub Pages в налаштуваннях репозиторію
2. ✅ Закомітьте та запушіть зміни
3. ✅ Дочекайтесь завершення GitHub Actions
4. ✅ Відкрийте свій сайт!

---

**Статус**: Готово до deploy  
**Дата**: 2025-10-25
