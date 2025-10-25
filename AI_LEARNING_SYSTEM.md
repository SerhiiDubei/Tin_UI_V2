# 🧠 Система навчання AI - Повна документація

## 📊 Як працює навчання

### 1️⃣ Збір даних (Data Collection)

#### Що збирається:
```
Кожен swipe користувача → База даних
┌─────────────────────────────────────────┐
│ ratings                                  │
├─────────────────────────────────────────┤
│ • content_id (UUID)                     │
│ • user_id (UUID)                        │
│ • direction (left/right/up/down)        │
│ • comment (TEXT, опціонально)           │
│ • latency_ms (швидкість реакції)        │
│ • created_at (timestamp)                │
└─────────────────────────────────────────┘
```

**Напрямки свайпів:**
- ➡️ `right` - Подобається (Like)
- ⬆️ `up` - Дуже подобається (Superlike)
- ⬅️ `left` - Не подобається (Dislike)
- ⬇️ `down` - Пропустити (Skip)

#### Де зберігається:
- **Таблиця**: `ratings`
- **Trigger**: Автоматично оновлює статистику в `content` після кожного rating
- **Зв'язок**: Один користувач → Багато ratings

---

### 2️⃣ Аналіз коментарів (Comment Analysis)

#### Коли відбувається:
```javascript
// Функція: updateUserInsights(userId)
// Викликається: Після кожних N свайпів або вручну
```

#### Що робиться:
1. **Збір останніх 50 ratings** користувача
2. **Розділення** на likes (right/up) та dislikes (left)
3. **Витягування коментарів** з кожної групи
4. **GPT-4o-mini аналізує** коментарі та визначає:
   - 📈 **Likes keywords**: що подобається (blonde, smile, natural, etc.)
   - 📉 **Dislikes keywords**: що не подобається (fake, plastic, dark, etc.)
   - 💡 **Suggestions**: рекомендації для покращення

#### Приклад аналізу:
```javascript
// Input (коментарі користувача):
[
  "Мені подобається натуральна усмішка",
  "Красиве світло, хороша якість фото",
  "Дівчина виглядає природньо"
]

// Output (GPT-4o-mini):
{
  "likes": ["natural", "smile", "light", "quality", "realistic"],
  "dislikes": [],
  "suggestions": ["Focus on natural lighting", "Emphasize genuine smiles"]
}
```

#### Код аналізу:
```javascript
// backend/src/services/openai.service.js
export async function analyzeComments(comments) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content: `Analyze user comments about generated content.
      Extract common themes, complaints, and preferences.
      Output JSON format with likes, dislikes, suggestions.`
    }, {
      role: 'user',
      content: comments.join('\n---\n')
    }],
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

### 3️⃣ Збереження insights (Saving Insights)

#### Таблиця user_insights:
```sql
CREATE TABLE user_insights (
  user_id UUID PRIMARY KEY,
  
  -- Що подобається (масив об'єктів)
  likes_json JSONB DEFAULT '[]',
  -- Приклад: [{"keyword": "natural", "count": 15}, {"keyword": "smile", "count": 12}]
  
  -- Що не подобається (масив об'єктів)
  dislikes_json JSONB DEFAULT '[]',
  -- Приклад: [{"keyword": "fake", "count": 8}, {"keyword": "dark", "count": 5}]
  
  -- Статистика
  total_swipes INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_dislikes INTEGER DEFAULT 0,
  total_superlikes INTEGER DEFAULT 0,
  
  -- Кращі приклади контенту
  gold_content_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Додаткові преференції
  preferences_json JSONB DEFAULT '{}',
  
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Приклад запису:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "likes_json": [
    {"keyword": "natural", "count": 25},
    {"keyword": "smile", "count": 20},
    {"keyword": "blonde", "count": 15},
    {"keyword": "outdoor", "count": 12}
  ],
  "dislikes_json": [
    {"keyword": "fake", "count": 10},
    {"keyword": "plastic", "count": 8},
    {"keyword": "dark", "count": 6}
  ],
  "total_swipes": 150,
  "total_likes": 100,
  "total_dislikes": 40,
  "total_superlikes": 10
}
```

---

### 4️⃣ Використання insights при генерації (Using Insights)

#### Коли використовується:
```javascript
// backend/src/routes/content.routes.js
router.post('/generate', async (req, res) => {
  const { prompt, userId } = req.body;
  
  // 1. Отримати insights користувача
  const userInsights = await getUserInsights(userId);
  
  // 2. Отримати insights з template (якщо є)
  const templateInsights = template?.insights_json;
  
  // 3. Об'єднати insights
  const context = {
    insights: {
      likes: [
        ...templateInsights?.likes || [],
        ...userInsights?.likes_json || []
      ],
      dislikes: [
        ...templateInsights?.dislikes || [],
        ...userInsights?.dislikes_json || []
      ]
    }
  };
  
  // 4. Покращити prompt з урахуванням insights
  const { enhancedPrompt } = await enhancePrompt(prompt, context);
  
  // 5. Згенерувати контент
  const result = await generateContent(enhancedPrompt, ...);
});
```

#### Як insights впливають на prompt:
```javascript
// backend/src/services/openai.service.js
export async function enhancePrompt(originalPrompt, context) {
  let userMessage = originalPrompt;
  
  // Додаємо insights до промпту
  if (context.insights) {
    const { likes = [], dislikes = [] } = context.insights;
    
    if (likes.length > 0) {
      userMessage += `\n\nUser preferences (likes):`;
      userMessage += `\nLikes: ${likes.slice(0, 5).map(l => l.keyword).join(', ')}`;
      // Приклад: "Likes: natural, smile, blonde, outdoor, quality"
    }
    
    if (dislikes.length > 0) {
      userMessage += `\nAvoid: ${dislikes.slice(0, 5).map(d => d.keyword).join(', ')}`;
      // Приклад: "Avoid: fake, plastic, dark, filters, artificial"
    }
  }
  
  // GPT-4o покращує prompt з урахуванням preferences
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  });
  
  return response.choices[0].message.content;
}
```

#### Приклад трансформації:

**Input (оригінальний prompt):**
```
"красива дівчина на пляжі"
```

**Context (insights користувача):**
```javascript
{
  likes: [
    {keyword: "natural", count: 25},
    {keyword: "smile", count: 20},
    {keyword: "blonde", count: 15}
  ],
  dislikes: [
    {keyword: "fake", count: 10},
    {keyword: "plastic", count: 8}
  ]
}
```

**Output (покращений prompt з insights):**
```
"A beautiful young woman with natural blonde hair on a sunny beach. 
She has a genuine, warm smile and natural-looking features. 
The photo is taken with natural sunlight, showing her in a relaxed, 
authentic pose. Avoid fake or plastic appearance, heavy makeup, 
or artificial filters. Focus on realistic beauty and natural setting."
```

---

### 5️⃣ Навчання для кожного користувача (Per-User Learning)

#### Користувач 1:
```json
{
  "likes": ["blonde", "smile", "beach"],
  "dislikes": ["dark", "indoor"]
}
```
**Генерація для User 1:** Більше блондинок, усміхнених, на пляжі

#### Користувач 2:
```json
{
  "likes": ["brunette", "serious", "city"],
  "dislikes": ["beach", "casual"]
}
```
**Генерація для User 2:** Більше брюнеток, серйозних, в місті

#### Ізольовані дані:
- ✅ Кожен користувач має свою `user_insights` запис
- ✅ Insights одного користувача НЕ впливають на іншого
- ✅ Кожна генерація використовує тільки insights ЦЬОГО користувача

---

### 6️⃣ Навчання для адміна (Admin Learning)

#### Що бачить адмін:

**Таблиця 1: Users**
```sql
SELECT * FROM users;
```
- Список всіх користувачів
- Email, username, роль (user/admin)

**Таблиця 2: All Content**
```sql
SELECT 
  content.*,
  users.username,
  COUNT(ratings.id) as total_ratings,
  content.likes_count,
  content.dislikes_count
FROM content
LEFT JOIN users ON content.user_id = users.id
LEFT JOIN ratings ON content.id = ratings.content_id
GROUP BY content.id;
```
- Весь згенерований контент
- Хто згенерував (username)
- Скільки ratings отримав
- Likes/dislikes

**Таблиця 3: All Requests (Ratings)**
```sql
SELECT 
  ratings.*,
  users.username,
  content.original_prompt
FROM ratings
JOIN users ON ratings.user_id = users.id
JOIN content ON ratings.content_id = content.id
ORDER BY ratings.created_at DESC;
```
- Всі swipes всіх користувачів
- Хто зробив swipe
- На якому контенті
- Коментар

#### AdminPage компонент:
```javascript
// frontend/src/pages/AdminPage.jsx
function AdminPage() {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [ratings, setRatings] = useState([]);
  
  // Завантажити всі дані
  useEffect(() => {
    loadAllUsers();
    loadAllContent();
    loadAllRatings();
  }, []);
  
  return (
    <div>
      <Tabs>
        <Tab label="Users">{/* users table */}</Tab>
        <Tab label="Content">{/* content table */}</Tab>
        <Tab label="Ratings">{/* ratings table */}</Tab>
      </Tabs>
    </div>
  );
}
```

---

### 7️⃣ Навчання для нових користувачів (New Users)

#### Початковий стан (день 1):
```json
{
  "user_id": "new-user-uuid",
  "likes_json": [],
  "dislikes_json": [],
  "total_swipes": 0
}
```
- Немає insights
- Генерація використовує тільки загальні правила (dating system prompt)
- Якісні, реалістичні фото за замовчуванням

#### Після 10 свайпів:
```json
{
  "likes_json": [
    {"keyword": "smile", "count": 7},
    {"keyword": "outdoor", "count": 5}
  ],
  "dislikes_json": [
    {"keyword": "dark", "count": 3}
  ],
  "total_swipes": 10
}
```
- AI починає помічати паттерни
- Генерація адаптується: більше усміхнених, outdoor фото

#### Після 50 свайпів:
```json
{
  "likes_json": [
    {"keyword": "natural", "count": 35},
    {"keyword": "smile", "count": 30},
    {"keyword": "blonde", "count": 25},
    {"keyword": "casual", "count": 20}
  ],
  "dislikes_json": [
    {"keyword": "fake", "count": 15},
    {"keyword": "plastic", "count": 12}
  ],
  "total_swipes": 50
}
```
- Чіткі преференції сформовані
- Генерація дуже персоналізована

---

### 8️⃣ Перевірка збереження в БД

#### Тестовий сценарій:

**1. Створити rating:**
```bash
curl -X POST http://localhost:5000/api/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "...",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "direction": "right",
    "comment": "Мені подобається натуральна усмішка",
    "latencyMs": 1500
  }'
```

**2. Перевірити збереження:**
```sql
-- У таблиці ratings
SELECT * FROM ratings 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at DESC LIMIT 1;

-- Результат:
{
  "id": "uuid",
  "content_id": "uuid",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "direction": "right",
  "comment": "Мені подобається натуральна усмішка",
  "latency_ms": 1500,
  "created_at": "2025-10-25T11:45:00Z"
}
```

**3. Перевірити автоматичне оновлення content stats:**
```sql
-- Trigger автоматично оновив content
SELECT likes_count, dislikes_count, total_ratings 
FROM content 
WHERE id = 'content-uuid';

-- Результат:
{
  "likes_count": 15,  -- +1
  "dislikes_count": 5,
  "total_ratings": 20  -- +1
}
```

**4. Оновити insights:**
```bash
curl -X POST http://localhost:5000/api/insights/user/550e8400-e29b-41d4-a716-446655440000/update
```

**5. Перевірити user_insights:**
```sql
SELECT * FROM user_insights 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Результат:
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "likes_json": [
    {"keyword": "natural", "count": 25},
    {"keyword": "smile", "count": 21}  -- оновлено!
  ],
  "total_swipes": 151,  -- +1
  "total_likes": 101,   -- +1
  "updated_at": "2025-10-25T11:45:30Z"
}
```

---

## ✅ Висновки

### Що працює:

1. **✅ Збір даних**
   - Кожен swipe → ratings таблиця
   - Коментарі зберігаються
   - Час реакції фіксується

2. **✅ Аналіз через AI**
   - GPT-4o-mini аналізує коментарі
   - Витягує keywords (likes/dislikes)
   - Генерує suggestions

3. **✅ Збереження insights**
   - user_insights для кожного користувача
   - Ізольовані дані
   - Автоматичне оновлення

4. **✅ Використання при генерації**
   - Insights передаються в context
   - GPT-4o враховує preferences
   - Персоналізована генерація

5. **✅ Для адміна**
   - Доступ до всіх users
   - Доступ до всього content
   - Доступ до всіх ratings
   - Аналітика та статистика

6. **✅ Для нових користувачів**
   - Початково пусті insights
   - Поступове накопичення даних
   - Адаптація після 10-50 свайпів

---

## 🔄 Життєвий цикл навчання:

```
Користувач робить swipe
         ↓
Зберігається в ratings (з коментарем)
         ↓
Trigger оновлює content.likes_count
         ↓
Періодично викликається updateUserInsights()
         ↓
GPT-4o-mini аналізує останні 50 коментарів
         ↓
Витягує keywords та зберігає в user_insights
         ↓
При наступній генерації insights використовуються
         ↓
GPT-4o генерує prompt з урахуванням preferences
         ↓
Контент більш персоналізований
         ↓
Користувач знову робить swipe...
```

**Система самонавчається з кожним swipe!** 🎯
