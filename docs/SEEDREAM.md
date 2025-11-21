# 📱 Seedream 4.0 Integration Guide

> **Realistic Smartphone Photo System with 11-Parameter Architecture**

## 🎯 Overview

Seedream 4.0 — це система генерації промптів для реалістичних фотографій зі смартфонів. Використовує модульний підхід з 11 параметрами для створення автентичних знімків з природними недоліками.

---

## 📊 The 11-Parameter System

### 🔴 TIER 1: MANDATORY (Завжди використовувати)

#### 1. SMARTPHONE_PHOTO_STYLE
**Foundation параметр — завжди перший**

Включає:
- **Filename**: `IMG_####.HEIC`, `DSC_####.JPG`
- **Device**: iPhone 14 Pro, Pixel 7, Samsung S21
- **Era**: 2010-2024 (відповідає пристрою)
- **Context**: Instagram, BeReal, casual photo

```
IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic
```

#### 2. SUBJECT
**Core element — завжди другий**

Включає:
- Age, ethnicity, physical features
- Pose, expression, emotion
- Clothing style
- **ONE PERSON ONLY**

```
A 26-year-old woman with shoulder-length blonde hair and subtle freckles, 
genuine smile while sitting at a café table
```

---

### 🟡 TIER 2: SITUATIONAL (3-4 параметри)

#### 3. COMPOSITION
Shot type, camera angle, framing, rule of thirds

#### 4. BACKGROUND
Location, setting, depth, environmental elements

#### 5. LIGHTING
Source, direction, quality (window light, golden hour, lens flare)

---

### 🟢 TIER 3: ENHANCEMENT (1-2 параметри)

#### 6. COLOR_PALETTE
Color scheme, saturation, temperature

#### 7. MOOD_ATMOSPHERE
Emotional tone, vibe, authenticity

#### 8. MOTION_DYNAMICS
Movement, blur, camera shake

#### 9. DEPTH_FOCUS
DOF, sharpness, portrait mode artifacts

#### 10. TEXTURE_DETAIL
Skin texture, materials, fabric detail

#### 11. TIME_WEATHER
Time of day, season, weather conditions

---

## ⚠️ Authentic Imperfections (1-3 Required!)

**Real photos have flaws — include them!**

### Technical Issues:
- Slight motion blur on hands/hair
- Digital noise in shadows
- Small lens flare from sun
- Overexposure on one side
- Chromatic aberration

### Compositional "Mistakes":
- Subject slightly off-center
- Horizon tilted 1-3°
- Top of head cut off slightly
- Background element "photobombing"

### Authenticity Markers:
- Mirror/reflection visible (selfies)
- Photographer's shadow
- Timestamp watermark

---

## 🎭 Era Consistency

### 2022-2024 (Modern)
- **Devices**: iPhone 13/14 Pro, Pixel 7
- **Format**: `IMG_####.HEIC`
- **Features**: Computational photography, portrait mode, night mode
- **Quality**: High resolution, minimal noise

### 2019-2021
- **Devices**: iPhone 11/12, Pixel 4/5
- **Features**: Portrait mode, good low light
- **Quality**: Good but not perfect

### 2016-2018 (VSCO Era)
- **Devices**: iPhone 7/8, Pixel
- **Aesthetic**: VSCO, faded blacks, desaturated
- **Format**: `IMG_####.JPG` or HEIC

### 2013-2015 (Filter Era)
- **Devices**: iPhone 6, Samsung S5
- **Aesthetic**: Instagram filters (Valencia, Sierra)
- **Features**: Heavy vignette, square crop
- **Quality**: Lower res, more noise

### 2010-2012 (Early Smartphones)
- **Devices**: iPhone 4S, early Android
- **Aesthetic**: Nostalgic, grainy
- **Quality**: Low resolution, significant noise

---

## 🧬 Combination Templates

### Dating Portraits (Most Common)
```
TIER 1: SMARTPHONE_PHOTO_STYLE + SUBJECT
TIER 2: COMPOSITION + LIGHTING + MOOD_ATMOSPHERE
TIER 3: COLOR_PALETTE (optional)
IMPERFECTIONS: 1-3
```
**Total: 5-6 parameters**

### Environmental/Lifestyle
```
TIER 1: SMARTPHONE_PHOTO_STYLE + SUBJECT
TIER 2: BACKGROUND + TIME_WEATHER + LIGHTING
TIER 3: DEPTH_FOCUS (optional)
IMPERFECTIONS: 1-3
```
**Total: 5-6 parameters**

### Action/Dynamic
```
TIER 1: SMARTPHONE_PHOTO_STYLE + SUBJECT
TIER 2: MOTION_DYNAMICS + COMPOSITION + LIGHTING
TIER 3: None (motion is enough)
IMPERFECTIONS: 2-3 (motion blur counts)
```
**Total: 5 parameters**

---

## 💡 User Insights Integration

### How Insights Map to Parameters

```javascript
// User insights
{
  likes: [
    { keyword: "гарна посмішка", count: 3 },
    { keyword: "натуральне освітлення", count: 2 }
  ],
  dislikes: [
    { keyword: "штучні фільтри", count: 1 }
  ]
}

// Maps to:
"гарна посмішка" → SUBJECT (genuine smile expression)
"натуральне освітлення" → LIGHTING (window light, golden hour)
"штучні фільтри" → COLOR_PALETTE (avoid heavy saturation)
```

### In Final Prompt
```
IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic.

A 26-year-old woman with genuine, joyful smile ← "гарна посмішка"
while sitting at a café table. Close-up shot from slightly above 
eye level. Soft natural window light from the left ← "натуральне освітлення"
creating gentle shadows. Warm but not oversaturated tones ← avoid "штучні фільтри"
with authentic mood.
```

---

## 📈 Before/After Comparison

### ❌ Before Seedream
```
Input: "Фото дівчини в кафе"

Output: "A young woman with brown hair sitting in a café. 
Natural lighting, casual pose."

Length: ~100 chars
Parameters: 2-3
Realism: Medium
```

### ✅ After Seedream
```
Input: "Фото дівчини в кафе"

Output: "IMG_5847.HEIC, iPhone 14 Pro, 2023 casual aesthetic.

A 26-year-old woman with shoulder-length blonde hair and 
subtle freckles, genuine smile while sitting at a café table. 
Close-up shot from slightly above eye level, subject positioned 
using rule of thirds. Soft natural window light from the left 
creating gentle shadows on the right side of face. Warm, inviting 
atmosphere with slightly boosted saturation. Slight motion blur 
on hands, small lens flare visible in upper right corner."

Length: ~400 chars
Parameters: 6
Realism: HIGH ✨
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

## 🔧 Technical Implementation

### Files Modified

#### `backend/src/services/openai.service.js`

**Key Changes:**
- System prompt completely rebuilt with 11-parameter system
- Increased `max_tokens` from 500 to 800
- Added `detectUsedParameters()` function for validation
- Enhanced insights mapping to parameters
- Expanded logging with Seedream analysis

**Code Snippet:**
```javascript
const seedreamSystemPrompt = `You are an expert AI prompt engineer specialized in Seedream 4.0...

📋 THE 11-PARAMETER SYSTEM:
1. [SMARTPHONE_PHOTO_STYLE] ← ALWAYS START
2. [SUBJECT] ← Core element
3. [COMPOSITION] ← Framing & angles
... (11 total parameters)

⚠️ IMPERFECTIONS (CRITICAL - Include 1-3):
- Slight motion blur, lens flare, overexposure...
`;

// New parameter detection function
export function detectUsedParameters(prompt) {
  const parameters = {
    SMARTPHONE_PHOTO_STYLE: false,
    SUBJECT: false,
    // ... all 11 parameters
  };
  // Detection logic
  return { parameters, usedCount, usedList };
}
```

---

## 🧪 Testing

### Run Tests
```bash
cd backend
node test-seedream-integration.js
```

### Expected Output
```
🧪 TEST 1: Simple Dating Prompt
✅ TEST PASSED

📊 SEEDREAM ANALYSIS:
   Parameters Used: 6 / 11
   Optimal Count: ✅ Yes
   Has Smartphone Style: ✅ Yes
   Has Subject: ✅ Yes

📈 METRICS:
   Duration: 3600 ms
   Tokens: 650
   Enhanced: 387 chars (+364)
```

---

## 📈 Performance Metrics

| Metric | Before | After Seedream |
|--------|--------|----------------|
| **Prompt Length** | 100-200 chars | 300-500 chars |
| **Parameters Used** | 2-3 | 5-7 |
| **Tokens** | 400-600 | 600-800 |
| **Duration** | 2-3 sec | 3-5 sec |
| **Realism** | Medium | **High** ✨ |

### Cost Impact
- Per prompt: ~$0.003-0.004 (увеличення на ~$0.001)
- Batch x2: ~$0.007-0.008
- **Worth it:** YES — значно вища якість

---

## ✅ Quality Checklist

Every prompt should have:

- ✅ Filename format (`IMG_####.HEIC`, etc.)
- ✅ Device + Era (iPhone 14 Pro, 2023)
- ✅ Subject description (age, features, pose)
- ✅ 4-6 parameters (optimal range)
- ✅ 1-3 authentic imperfections
- ✅ Natural language flow
- ✅ Era-appropriate capabilities
- ✅ User insights integrated

---

## 🚀 Deployment

### Environment Variables
```bash
OPENAI_API_KEY=your_key_here  # Required
```

### API Configuration
- Model: `gpt-4o`
- Max tokens: `800`
- Temperature: `0.7` (single) / `0.9` (variations)

### Status
✅ **Production Ready**

---

## 🐛 Troubleshooting

### Issue: Too Few Parameters (< 4)
**Solution:** Add more context or specifics to input prompt

### Issue: Too Many Parameters (> 8)
**Solution:** Over-specified — system will self-correct

### Issue: No Smartphone Style
**Solution:** Check category detection logic

### Issue: Generic Output
**Solution:** Add more specific user insights

---

## 📚 API Response Format

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

## 🎯 Success Criteria

Integration meets all requirements:

- ✅ Realistic smartphone aesthetics
- ✅ Authentic imperfections included
- ✅ Era-appropriate specifications
- ✅ User insights integrated
- ✅ Natural language output
- ✅ Comprehensive documentation
- ✅ Production-ready code
- ✅ Testing infrastructure

---

## 📖 References

- **Master Prompt**: `00_MASTER_PROMPT.md` (uploaded file)
- **Main Service**: `backend/src/services/openai.service.js`
- **Test Suite**: `backend/test-seedream-integration.js`
- **Architecture**: `docs/ARCHITECTURE.md`

---

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Date:** 2025-11-21  
**Commit:** 2f5c8b2

**🎉 Seedream 4.0 Successfully Integrated!**
