# 📱 Seedream 4.0 Integration - 11-Parameter System

## 🎯 Overview

Система генерації промптів тепер інтегрована з **Seedream 4.0 Realistic Smartphone Photo System**, яка використовує 11 модульних параметрів для створення автентичних фотографій, що виглядають як реальні знімки зі смартфонів.

---

## 🔧 Основні Зміни

### ✅ Що Змінено:

1. **System Prompt** - Повністю перероблений з урахуванням 11 параметрів
2. **User Message** - Додано структуроване форматування insights
3. **Max Tokens** - Збільшено до 800 (для детальніших промптів)
4. **Parameter Detection** - Нова функція `detectUsedParameters()`
5. **Logging** - Розширене логування з аналізом параметрів

### 📋 Нові Файли:

- `backend/src/services/openai.service.js` - Оновлений
- `backend/test-seedream-integration.js` - Тестовий файл
- `docs/SEEDREAM_INTEGRATION.md` - Ця документація

---

## 🎨 11-Parameter System

### 🔴 TIER 1: MANDATORY (Завжди)

#### 1️⃣ SMARTPHONE_PHOTO_STYLE
**Foundation - завжди перший**

**Що включає:**
- Filename format: `IMG_####.HEIC`, `DSC_####.JPG`, `CR2`
- Device: iPhone 13/14 Pro, Pixel 7, Samsung S21
- Era: 2010-2024 (відповідає пристрою)
- Platform context: Instagram, BeReal, casual photo

**Приклад:**
```
IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic
```

#### 2️⃣ SUBJECT
**Core element - завжди другий**

**Що включає:**
- Age, ethnicity, physical features
- Pose, expression, emotion
- Clothing style
- ONE PERSON ONLY (ніколи не multiple)

**Приклад:**
```
A 26-year-old woman with shoulder-length blonde hair and subtle freckles, 
genuine smile while sitting at a café table
```

---

### 🟡 TIER 2: SITUATIONAL (Вибрати 3-4)

#### 3️⃣ COMPOSITION
**Framing & angles**

**Коли використовувати:** Portraits, selfies, action shots

**Що включає:**
- Shot type: close-up, medium, full-body
- Camera angle: eye level, slightly above/below
- Framing: rule of thirds, centered, off-center
- **ВАЖЛИВО:** Casual mistakes (slightly off-center, tilted)

**Приклад:**
```
Close-up shot from slightly above eye level, subject positioned 
using rule of thirds. Horizon tilted 2 degrees.
```

#### 4️⃣ BACKGROUND
**Setting & environment**

**Коли використовувати:** Environmental shots, lifestyle photos

**Що включає:**
- Location: café, park, bedroom, street
- Detail level: blurred, detailed, minimal
- Elements: furniture, nature, urban elements

**Приклад:**
```
Tree-lined background with dappled sunlight and slightly blurred foliage
```

#### 5️⃣ LIGHTING
**Light characteristics**

**Коли використовувати:** Завжди важливо, особливо portraits

**Що включає:**
- Source: window light, golden hour, indoor lamp
- Direction: from left/right, backlit, front-lit
- Quality: soft, harsh, mixed
- Effects: lens flare, overexposure on one side

**Приклад:**
```
Soft natural window light from the left creating gentle shadows 
on the right side of face. Small lens flare visible in upper right corner.
```

---

### 🟢 TIER 3: ENHANCEMENT (Вибрати 1-2)

#### 6️⃣ COLOR_PALETTE
**Color scheme**

**Коли використовувати:** Era-specific looks, artistic shots

**Що включає:**
- Scheme: warm, cool, neutral, saturated
- Dominant colors: 2-3 main colors
- Temperature: warm/cool tones

**Приклад:**
```
Warm oranges and soft greens throughout. Slightly boosted saturation.
```

#### 7️⃣ MOOD_ATMOSPHERE
**Emotional tone**

**Коли використовувати:** Portraits, lifestyle shots

**Що включає:**
- Emotion: joyful, relaxed, confident, casual
- Vibe: authentic, intimate, energetic
- Context: spontaneous moment, posed but natural

**Приклад:**
```
Warm, inviting atmosphere with relaxed expression and authentic mood
```

#### 8️⃣ MOTION_DYNAMICS
**Movement & blur**

**Коли використовувати:** Action shots, dynamic moments

**Що включає:**
- Type: slight motion blur, camera shake, static
- On what: hands, hair, background
- Reason: walking, wind, spontaneous capture

**Приклад:**
```
Slight motion blur on hands from movement, background slightly 
blurred due to walking
```

#### 9️⃣ DEPTH_FOCUS
**DOF & sharpness**

**Коли використовувати:** Portrait mode, artistic shots

**Що включає:**
- DOF: shallow (portrait mode), deep, mixed
- Focus point: face sharp, background blurred
- Portrait mode artifacts: edge separation issues

**Приклад:**
```
Shallow depth of field from portrait mode. Natural portrait mode 
edge separation with minor artifacts around hair strands.
```

#### 🔟 TEXTURE_DETAIL
**Surface quality**

**Коли використовувати:** Close-ups, detailed shots

**Що включає:**
- Skin: natural, freckles, pores visible
- Materials: fabric, hair, environmental textures
- Detail level: crisp, slightly soft, grainy

**Приклад:**
```
Natural skin texture with subtle freckles visible. 
Fabric detail crisp but slightly grainy in shadows.
```

#### 1️⃣1️⃣ TIME_WEATHER
**Temporal conditions**

**Коли використовувати:** Environmental shots, outdoor photos

**Що включає:**
- Time: golden hour, midday, evening
- Season: summer, autumn, winter (implied)
- Weather: sunny, overcast, indoor

**Приклад:**
```
Golden hour backlight with sun filtering through leaves. 
Late afternoon ambiance suggesting early autumn.
```

---

## ⚠️ IMPERFECTIONS (1-3 Required!)

### 🔴 Technical Issues:
- Slight motion blur on hands/hair
- Digital noise in shadows
- Small lens flare from sun
- Overexposure on one side
- Chromatic aberration edges
- Compression artifacts

### 🟡 Compositional "Mistakes":
- Subject slightly off-center
- Horizon not perfectly level (1-3° tilt)
- Top of head cut off slightly
- Background element "photobombing"
- Awkward framing

### 🟢 Authenticity Markers:
- Mirror/reflection visible (selfies)
- Photographer's shadow visible
- Timestamp watermark

---

## 📊 Combination Logic

### For Dating Portraits (Most Common):
```
TIER 1: SMARTPHONE_PHOTO_STYLE + SUBJECT
TIER 2: COMPOSITION + LIGHTING + MOOD_ATMOSPHERE
TIER 3: COLOR_PALETTE (optional)
IMPERFECTIONS: 1-3
```

**Total: 5-6 parameters**

### For Environmental/Lifestyle:
```
TIER 1: SMARTPHONE_PHOTO_STYLE + SUBJECT
TIER 2: BACKGROUND + TIME_WEATHER + LIGHTING
TIER 3: DEPTH_FOCUS (optional)
IMPERFECTIONS: 1-3
```

**Total: 5-6 parameters**

### For Action/Dynamic:
```
TIER 1: SMARTPHONE_PHOTO_STYLE + SUBJECT
TIER 2: MOTION_DYNAMICS + COMPOSITION + LIGHTING
TIER 3: None (motion is enough)
IMPERFECTIONS: 2-3 (motion blur counts)
```

**Total: 5 parameters**

---

## 🎭 Era Consistency

### 2022-2024 (Modern):
- **Devices:** iPhone 13/14 Pro, Pixel 7
- **Format:** IMG_####.HEIC
- **Features:** Computational photography, portrait mode, night mode
- **Quality:** High resolution, minimal noise

### 2019-2021:
- **Devices:** iPhone 11/12, Pixel 4/5
- **Format:** IMG_####.HEIC
- **Features:** Portrait mode, good low light
- **Quality:** Good but not perfect

### 2016-2018:
- **Devices:** iPhone 7/8, Pixel
- **Format:** IMG_####.JPG or HEIC
- **Aesthetic:** VSCO, faded blacks, desaturated
- **Quality:** Decent with some limitations

### 2013-2015 (Filter Era):
- **Devices:** iPhone 6, Samsung S5
- **Format:** IMG_####.JPG
- **Aesthetic:** Instagram filters (Valencia, Sierra)
- **Features:** Heavy vignette, saturated, square crop
- **Quality:** Lower res, more noise

### 2010-2012 (Early):
- **Devices:** iPhone 4S, early Android
- **Format:** IMG_####.JPG
- **Aesthetic:** Nostalgic, grainy
- **Quality:** Low resolution, significant noise

---

## 💡 How Insights Are Applied

### User Insights Format:
```javascript
{
  likes: [
    { keyword: "гарна посмішка", count: 3 },
    { keyword: "натуральне освітлення", count: 2 }
  ],
  dislikes: [
    { keyword: "штучні фільтри", count: 1 }
  ]
}
```

### Mapped to Parameters:
```
"гарна посмішка" → SUBJECT (expression)
"натуральне освітлення" → LIGHTING (window light, golden hour)
"штучні фільтри" → COLOR_PALETTE (avoid heavy saturation)
```

### In Final Prompt:
```
IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic.

A 26-year-old woman with genuine, joyful smile ← "гарна посмішка"
while sitting at a café table. Close-up shot from slightly above 
eye level. Soft natural window light from the left ← "натуральне освітлення"
creating gentle shadows. Warm but not oversaturated tones ← avoid "штучні фільтри"
with authentic mood.
```

---

## 🧪 Testing

### Run Tests:
```bash
cd backend
node test-seedream-integration.js
```

### Test Output:
```
🧪 TEST 1: Simple Dating Prompt
─────────────────────────────────────────
Input: Фото дівчини в кафе
Enhanced: IMG_6234.HEIC, iPhone 14 Pro, 2023...

📊 SEEDREAM ANALYSIS:
   Parameters Used: 6 / 11
   Parameters: SMARTPHONE_PHOTO_STYLE, SUBJECT, COMPOSITION, 
               LIGHTING, MOOD_ATMOSPHERE, COLOR_PALETTE
   Optimal Count: ✅ Yes
   Has Smartphone Style: ✅ Yes
   Has Subject: ✅ Yes

📈 METRICS:
   Duration: 3600 ms
   Tokens: 650
   Original: 23 chars → Enhanced: 387 chars
```

---

## 📈 Performance Metrics

### Expected Output:

| Metric | Before | After Seedream |
|--------|--------|----------------|
| **Prompt Length** | 100-200 chars | 300-500 chars |
| **Parameters Used** | 3-4 | 5-7 |
| **Tokens** | 400-600 | 600-800 |
| **Duration** | 2-3 sec | 3-5 sec |
| **Authenticity** | Medium | High |

### Quality Indicators:

✅ **Good Prompt:**
- 4-8 parameters used
- Has SMARTPHONE_PHOTO_STYLE
- Has SUBJECT
- Includes 1-3 imperfections
- Natural language flow
- 300-500 characters

⚠️ **Needs Improvement:**
- < 4 parameters (too simple)
- > 8 parameters (over-specified)
- No filename/device
- No imperfections
- Tagged format visible

---

## 🔧 API Response Format

### Enhanced Response:
```javascript
{
  success: true,
  enhancedPrompt: "IMG_5847.HEIC, iPhone 14 Pro...",
  meta: {
    duration: 3600,
    tokens: 650,
    originalLength: 23,
    enhancedLength: 387,
    seedream: {
      parametersUsed: 6,
      parametersList: [
        "SMARTPHONE_PHOTO_STYLE",
        "SUBJECT",
        "COMPOSITION",
        "LIGHTING",
        "MOOD_ATMOSPHERE",
        "COLOR_PALETTE"
      ],
      isOptimal: true,
      hasSmartphoneStyle: true,
      hasSubject: true
    }
  }
}
```

---

## 📝 Example Prompts

### Example 1: Casual Selfie
**Input:** "Селфі в кімнаті"

**Output:**
```
IMG_6234.HEIC, iPhone 14 Pro, 2023 casual selfie aesthetic.

A 25-year-old woman with loose brown hair in a messy bun, wearing 
a comfortable oversized sweater, taking a mirror selfie in a warmly 
lit bedroom. Close-up shot from slightly above, phone held at arm's 
length with slight Dutch angle. Soft lamp light from bedside table 
creating warm ambiance, with natural window light supplementing from 
the left. Casual, authentic mood with relaxed expression. Mirror 
slightly smudged, top of head cut off at upper frame edge, slight 
overexposure on the right side of face.
```

**Parameters:** STYLE, SUBJECT, COMPOSITION, LIGHTING, MOOD, TEXTURE (6)

---

### Example 2: Golden Hour Portrait
**Input:** "Фото дівчини на заході сонця"

**Output:**
```
IMG_8934.HEIC, iPhone 14 Pro, 2023 natural light portrait.

A 29-year-old woman with flowing auburn hair, wearing a simple 
cream-colored blouse, standing in an open field during golden hour. 
Medium shot from slightly below eye level, positioned using rule of 
thirds with negative space on right side. Warm backlight from setting 
sun creating rim lighting effect around hair and shoulders, with soft 
fill light from sky illuminating face. Park setting with trees softly 
blurred in background, shallow depth of field from portrait mode. 
Warm golden and soft orange tones dominating palette. Small lens 
flare visible in upper left corner, slight overexposure on highlighted 
edges of hair, natural portrait mode edge separation with minor 
artifacts around hair strands.
```

**Parameters:** STYLE, SUBJECT, COMPOSITION, BACKGROUND, LIGHTING, COLOR, DEPTH, TIME (8)

---

### Example 3: Instagram 2015 Aesthetic
**Input:** "Ретро фото в стилі 2015"

**Output:**
```
IMG_2847.JPG, iPhone 6, 2014, Instagram Valencia filter applied, 
square crop format.

A 23-year-old woman in bohemian festival attire with flower crown 
and fringe vest, arms raised in celebration pose at outdoor music 
festival. Medium shot centered in square frame, crowd visible but 
blurred in background. Harsh midday sunlight with heavy vignette 
darkening edges. Warm, saturated color palette with boosted oranges 
and teals, characteristic mid-2010s Instagram aesthetic. Visible 
digital noise in shadow areas, crushed blacks, slightly overexposed 
highlights, heavy contrast typical of Valencia filter processing.
```

**Parameters:** STYLE, SUBJECT, COMPOSITION, BACKGROUND, LIGHTING, COLOR, MOOD (7)

---

## 🚀 Deployment Notes

### Environment Variables:
```bash
OPENAI_API_KEY=your_key_here  # Required
```

### API Limits:
- Max tokens increased to 800
- Temperature: 0.7 (single) / 0.9 (variations)
- Model: gpt-4o

### Cost Estimate:
- Per prompt: ~600-800 tokens
- Cost: ~$0.003-0.004 per enhancement
- Batch (x2): ~$0.007-0.008

---

## ✅ Quality Checklist

Before finalizing:

- [ ] Filename format included (IMG_####, DSC_####)
- [ ] Device specified and era-consistent
- [ ] Year/era mentioned
- [ ] Subject clearly described
- [ ] 4-6 parameters used (optimal range)
- [ ] 1-3 imperfections included
- [ ] Natural language (no tags)
- [ ] Authentic smartphone realism
- [ ] Era-appropriate capabilities

---

## 🐛 Troubleshooting

### Issue: Too Few Parameters (< 4)
**Solution:** Prompt may be too simple. Add context or specifics.

### Issue: Too Many Parameters (> 8)
**Solution:** Over-specified. System will self-correct in next iteration.

### Issue: No Smartphone Style
**Solution:** Check if category detection worked correctly.

### Issue: Generic Output
**Solution:** Add more specific insights or context.

---

## 📚 References

- Master Prompt: `/uploaded_files/00_MASTER_PROMPT.md`
- OpenAI Service: `/backend/src/services/openai.service.js`
- Test File: `/backend/test-seedream-integration.js`

---

**Version:** 1.0  
**Date:** 2025-11-21  
**Status:** ✅ Production Ready

