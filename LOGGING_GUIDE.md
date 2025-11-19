# 📊 Детальне Логування OpenAI Промптів

## 🎯 Що Це Дає

Тепер кожен запит до OpenAI логується детально в консолі Vercel. Ви бачите **ВЕСЬ ПРОЦЕС**:
1. Що надіслано до OpenAI
2. Як insights (лайки/дизлайки) впливають на промпт
3. Що OpenAI повертає
4. Скільки токенів використано
5. Скільки часу зайняло

---

## 🔍 Що Логується

### 1. Content Generation Request (`/api/content/generate`)

```
🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨
🎨 CONTENT GENERATION REQUEST - START
🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨
📝 Original Prompt: красива дівчина на пляжі
🎬 Content Type: image
🔢 Count: 3
👤 User ID: demo-user-123
📋 Template ID: none
🎛️  Model Key: default
⚙️  Custom Params: none

🔍 Fetching user insights...
✅ User insights found:
   Total swipes: 47
   Likes keywords: 8
   Dislikes keywords: 5

📊 CONTEXT FOR ENHANCEMENT:
   Template likes: 0
   User likes: 8
   Template dislikes: 0
   User dislikes: 5
   Total likes in context: 8
   Total dislikes in context: 5
```

**Показує**:
- Оригінальний промпт користувача
- Скільки контенту генерувати
- Чи є insights користувача
- Скільки лайків/дизлайків буде використано

---

### 2. Category Detection (`detectCategory`)

```
================================================================================
🎯 OPENAI CATEGORY DETECTION - START
================================================================================
📝 Prompt: красива дівчина на пляжі
🎬 Content Type: image

⏳ Calling OpenAI API...

✅ Category Detected!
   Duration: 432 ms
   Total Tokens: 87
   🎭 Category: DATING

================================================================================
🎯 OPENAI CATEGORY DETECTION - END
================================================================================
```

**Показує**:
- Який промпт аналізується
- Яку категорію OpenAI визначив
- Скільки токенів і часу використано

---

### 3. Prompt Enhancement (`enhancePrompt`)

```
================================================================================
🤖 OPENAI PROMPT ENHANCEMENT - START
================================================================================
📝 Original Prompt: красива дівчина на пляжі
🎯 Context: {
  "systemInstructions": null,
  "insights": {
    "likes": [
      {"keyword": "blonde hair", "count": 5},
      {"keyword": "natural smile", "count": 4},
      {"keyword": "casual clothing", "count": 3}
    ],
    "dislikes": [
      {"keyword": "too much makeup", "count": 3},
      {"keyword": "artificial pose", "count": 2}
    ]
  },
  "category": "dating",
  "variationIndex": 0
}
🎭 Content Type: DATING
🔢 Variation Index: 0

📊 USER INSIGHTS DETECTED:
   ❤️  Likes: 8 items
   💔 Dislikes: 5 items
   ✅ Adding likes to prompt: blonde hair, natural smile, casual clothing, beach setting, golden hour
   ❌ Adding dislikes to prompt: too much makeup, artificial pose, heavy filters

🔧 OpenAI Request Configuration:
   Model: gpt-4o
   Temperature: 0.9
   Max Tokens: 500

📤 SYSTEM PROMPT:
────────────────────────────────────────────────────────────────────────────────
You are an expert prompt engineer specializing in creating dating profile photos...
YOUR MAIN GOAL: Generate realistic, attractive, diverse photos of people for dating apps...
────────────────────────────────────────────────────────────────────────────────

📤 USER MESSAGE:
────────────────────────────────────────────────────────────────────────────────
красива дівчина на пляжі

🚨 CRITICAL: Create a SINGLE, STANDALONE prompt describing ONE PERSON ONLY...

User preferences (from previous feedback):
Likes: blonde hair, natural smile, casual clothing, beach setting, golden hour
Avoid: too much makeup, artificial pose, heavy filters
────────────────────────────────────────────────────────────────────────────────

⏳ Calling OpenAI API...

✅ OpenAI Response Received!
   Duration: 1847 ms
   Finish Reason: stop
   Total Tokens: 524
   Prompt Tokens: 312
   Completion Tokens: 212

📥 ENHANCED PROMPT:
────────────────────────────────────────────────────────────────────────────────
A beautiful young woman with long, naturally flowing blonde hair stands on a 
sunny beach during golden hour. She wears a casual white linen sundress and 
has a genuine, warm smile on her face as she looks directly at the camera. 
The soft, golden light creates a natural glow on her skin, highlighting her 
relaxed and approachable demeanor. The beach background is slightly blurred, 
with gentle waves and soft sand visible. She has minimal, natural-looking 
makeup that enhances her features without looking overdone. Her pose is 
natural and effortless, with one hand gently tucking hair behind her ear. 
The overall atmosphere is warm, inviting, and authentic, capturing a moment 
of genuine joy and confidence. Shot with natural lighting, photographic 
quality, realistic skin tones, and a shallow depth of field.
────────────────────────────────────────────────────────────────────────────────

📊 COMPARISON:
   Original length: 28 chars
   Enhanced length: 612 chars
   Change: +584 chars

================================================================================
🤖 OPENAI PROMPT ENHANCEMENT - END
================================================================================
```

**Показує**:
- **SYSTEM PROMPT** - інструкції для OpenAI
- **USER MESSAGE** - що ми відправляємо включно з insights
- **Insights** - які лайки/дизлайки додаються
- **Відповідь OpenAI** - фінальний enhanced prompt
- **Статистику** - токени, час, довжина

**ЦЕ НАЙВАЖЛИВІШЕ!** Тут ви бачите як саме insights впливають на промпт!

---

### 4. User Insights Update (`/api/insights/user/:id/update`)

```
🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
📊 USER INSIGHTS UPDATE - START
🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
👤 User ID: demo-user-123

📊 Found 47 ratings to analyze
   ➡️  Right swipes: 32
   ⬆️  Up swipes (superlikes): 5
   ⬅️  Left swipes: 10
   ⬇️  Down swipes: 0

💬 COMMENTS ANALYSIS:
   ❤️  Like comments: 18
   💔 Dislike comments: 6

🔍 Analyzing LIKE comments...
```

**Потім для кожного коментаря:**

```
================================================================================
🧠 OPENAI COMMENT ANALYSIS - START
================================================================================
📝 Total Comments: 18
✅ Valid Comments: 18

💬 COMMENTS TO ANALYZE:
────────────────────────────────────────────────────────────────────────────────
1. Подобається натуральна усмішка
2. Гарне світло, природне
3. Красивий фон, пляж
4. Класний стиль одягу
... (всі коментарі)
────────────────────────────────────────────────────────────────────────────────

⏳ Calling OpenAI API for comment analysis...

✅ Analysis Complete!
   Duration: 1234 ms
   Total Tokens: 345

📊 ANALYSIS RESULTS:
────────────────────────────────────────────────────────────────────────────────
❤️  LIKES: 12 keywords
   1. natural smile
   2. good lighting
   3. beach background
   4. casual style
   5. blonde hair
   ... (всі)

💔 DISLIKES: 7 keywords
   1. too much makeup
   2. artificial pose
   3. fake background
   ... (всі)

💡 SUGGESTIONS: 5 items
   1. Use more natural lighting
   2. Focus on authentic smiles
   3. Prefer casual, comfortable clothing
   ... (всі)
────────────────────────────────────────────────────────────────────────────────

================================================================================
🧠 OPENAI COMMENT ANALYSIS - END
================================================================================
```

**Потім фінальна статистика:**

```
✅ INSIGHTS UPDATED SUCCESSFULLY!
────────────────────────────────────────────────────────────────────────────────
📈 Statistics:
   Total Swipes: 47
   Likes: 37 (78.7%)
   Dislikes: 10 (21.3%)
   Superlikes: 5

❤️  TOP LIKES:
   1. natural smile (8x)
   2. good lighting (6x)
   3. beach setting (5x)
   4. casual clothing (5x)
   5. blonde hair (4x)

💔 TOP DISLIKES:
   1. too much makeup (4x)
   2. artificial pose (3x)
   3. fake background (2x)
   4. heavy filters (2x)
   5. studio lighting (1x)

💡 SUGGESTIONS:
   1. Use more natural lighting
   2. Focus on authentic smiles
   3. Prefer casual, comfortable clothing
   4. Choose realistic outdoor backgrounds
   5. Avoid heavy makeup and filters
────────────────────────────────────────────────────────────────────────────────

🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
📊 USER INSIGHTS UPDATE - END
🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
```

**Показує**:
- Всі коментарі що аналізуються
- Як OpenAI витягує keywords
- Top лайки/дизлайки з частотою
- Suggestions для покращення

---

## 📍 Де Дивитися Логи

### Vercel Logs (Production):

1. Перейдіть: https://vercel.com/serhiis-projects-0e324256/tin-ui-v2/logs
2. Виберіть function: `src/server.js`
3. Побачите всі логи в реальному часі

### Локально (Development):

```bash
cd backend
npm run dev
```

Всі логи будуть в термінала.

---

## 🎯 Як Використовувати

### Сценарій 1: Тестування Впливу Insights

1. **Згенеруйте контент БЕЗ оцінок**
   - Зайдіть на `/generate`
   - Введіть промпт
   - Дивіться в Vercel logs - немає insights

2. **Поставте оцінки (свайпи)**
   - Свайпайте декілька контентів
   - Додайте коментарі

3. **Оновіть insights**
   - Натисніть "Update Insights" в Settings
   - Дивіться в logs як OpenAI аналізує коментарі

4. **Згенеруйте контент ЗНОВУ**
   - Той самий промпт
   - Дивіться в logs - тепер є insights!
   - Порівняйте enhanced prompts

### Сценарій 2: Дебаг Чому Промпт Не Працює

Якщо згенерований контент не той що хочете:

1. **Подивіться в logs на `ENHANCED PROMPT`**
   - Чи там є те що ви хотіли?
   - Може OpenAI щось додав/прибрав?

2. **Подивіться на `USER INSIGHTS DETECTED`**
   - Чи правильні keywords в likes/dislikes?
   - Може треба більше оцінок?

3. **Подивіться на `SYSTEM PROMPT`**
   - Чи правильні інструкції?
   - Може треба змінити template?

### Сценарій 3: Оптимізація Токенів

1. Дивіться на `Total Tokens` в кожному запиті
2. Якщо занадто багато (>1000):
   - Зменшіть кількість insights (top 5)
   - Скоротіть system prompt
   - Зменшіть max_tokens

---

## 🔧 Налаштування Логування

### Вимкнути Детальне Логування (Production):

Якщо логів забагато, можете додати змінну в Vercel:

```
ENABLE_DETAILED_LOGGING=false
```

І обгорнути логи в код:

```javascript
if (process.env.ENABLE_DETAILED_LOGGING !== 'false') {
  console.log('...');
}
```

### Зберігати Логи в Файл (Локально):

```bash
cd backend
npm run dev > logs/app.log 2>&1
```

---

## 📊 Приклад Повного Флоу

```
1. USER REQUEST
🎨 CONTENT GENERATION REQUEST - START
   📝 Prompt: красива дівчина
   👤 User: demo-user-123

2. FETCH INSIGHTS
   ✅ User insights: 8 likes, 5 dislikes

3. DETECT CATEGORY
🎯 Category: DATING

4. ENHANCE PROMPT (Variation 1)
🤖 Original: "красива дівчина"
   📊 Adding insights: blonde hair, natural smile...
   ✅ Enhanced: "A beautiful young woman with..."
   
5. ENHANCE PROMPT (Variation 2)
🤖 Original: "красива дівчина"
   📊 Adding insights: blonde hair, natural smile...
   ✅ Enhanced: "A stunning brunette woman with..."

6. ENHANCE PROMPT (Variation 3)
🤖 Original: "красива дівчина"
   📊 Adding insights: blonde hair, natural smile...
   ✅ Enhanced: "An attractive redhead with..."

7. GENERATE IMAGES
   ⏳ Generating 3 images...
   ✅ All 3 successful

8. SAVE TO DATABASE
   ✅ Content saved: 3 items

9. RESPONSE
🎨 CONTENT GENERATION - SUCCESS
```

---

## 🎁 Бонус: Які Insights Найбільше Впливають

З логів ви побачите що **найбільше впливає**:

1. **Top 5 Likes** - додаються до промпту як "prefer these"
2. **Top 5 Dislikes** - додаються як "avoid these"
3. **System Prompt** - базові інструкції для OpenAI
4. **Temperature** - 0.7 для single, 0.9 для variations
5. **Variation Index** - для створення різних варіантів

---

## 🚀 Що Далі

Тепер ви можете:

1. ✅ **Бачити кожен крок** OpenAI мислення
2. ✅ **Розуміти** як insights впливають на результат
3. ✅ **Оптимізувати** промпти базуючись на логах
4. ✅ **Дебагити** проблеми з генерацією
5. ✅ **Експериментувати** з різними підходами

---

**Всі логи тепер в Vercel після деплою!** 🎉

**Для локального тестування просто запустіть `npm run dev` в backend!** 💻
