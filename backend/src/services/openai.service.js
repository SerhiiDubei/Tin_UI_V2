import OpenAI from 'openai';
import config from '../config/index.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

/**
 * Enhance prompt using GPT-4o with variation support
 */
export async function enhancePrompt(originalPrompt, context = {}) {
  try {
    // Determine if this is dating content
    const isDating = context.category === 'dating' || 
                     /дівчин|хлопц|жінк|чолов|баб|тьолк|чувак|пацан|дівк|красун|модел|люд|особ|man|woman|girl|boy|person|model|флірт|роман|date|dating|romance|flirt|attractive|sexy|cute/i.test(originalPrompt);
    
    // Dating-specific system prompt
    const datingSystemPrompt = `You are an expert prompt engineer specializing in creating dating profile photos and romantic content. 

YOUR MAIN GOAL: Generate realistic, attractive, diverse photos of people for dating apps.

IMPORTANT RULES:
1. Create REALISTIC, photographic images (not illustrations or paintings)
2. Focus on natural beauty, authentic emotions, genuine smiles
3. Use natural lighting, realistic backgrounds (apartments, cafes, parks, streets)
4. Person should look approachable, friendly, attractive but natural
5. Avoid plastic/fake look, heavy filters, artificial lighting
6. Include details: clothing style, pose, expression, setting, mood
7. Make person look confident but not arrogant, attractive but not overly sexual
8. Age range: 20-35 years old (unless specified otherwise)
9. Lighting: soft natural light, golden hour, window light preferred
10. Background: slightly blurred, not distracting

VARIETY: If generating multiple images, vary:
- Hair color/style
- Clothing style (casual, sporty, elegant)
- Setting (home, outdoor, cafe, gym)
- Pose and expression
- Time of day and lighting
- Camera angle

Return a detailed, specific prompt in Ukrainian or English.`;

    const defaultSystemPrompt = 'You are an expert prompt engineer. Improve the given prompt to generate better AI content. Make it detailed, specific, and optimized for image generation.';
    
    const systemPrompt = isDating ? datingSystemPrompt : (context.systemInstructions || defaultSystemPrompt);
    
    // Add variation instruction if this is part of a batch
    let userMessage = originalPrompt;
    
    if (context.variationIndex !== undefined && context.variationIndex > 0) {
      userMessage += `\n\n[VARIATION ${context.variationIndex + 1}]: Create a DIFFERENT version with unique details (different hair, clothes, setting, pose, expression). Keep the main theme but change visual details significantly.`;
    }
    
    // Add insights if available
    if (context.insights) {
      const { likes = [], dislikes = [] } = context.insights;
      if (likes.length > 0 || dislikes.length > 0) {
        userMessage += '\n\nUser preferences (from previous feedback):';
        if (likes.length > 0) {
          userMessage += `\nLikes: ${likes.slice(0, 5).map(l => l.keyword || l).join(', ')}`;
        }
        if (dislikes.length > 0) {
          userMessage += `\nAvoid: ${dislikes.slice(0, 5).map(d => d.keyword || d).join(', ')}`;
        }
      }
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: context.variationIndex !== undefined ? 0.9 : 0.7, // Higher temp for variations
      max_tokens: 500
    });
    
    return {
      success: true,
      enhancedPrompt: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('OpenAI enhance error:', error);
    return {
      success: false,
      error: error.message,
      enhancedPrompt: originalPrompt // fallback
    };
  }
}

/**
 * Detect category from prompt using GPT-4o-mini
 */
export async function detectCategory(prompt, contentType = 'image') {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `You are a content categorization expert. Analyze the user's prompt and determine the most appropriate category.

PRIORITY: If the prompt mentions ANY person (дівчина, хлопець, жінка, чоловік, баба, тьолка, чувак, пацан, дівка, красуня, модель, людина, особа, man, woman, girl, boy, person, model, etc.) or romantic/flirty context (флірт, романтика, побачення, свідання, date, dating, romance, flirt, attractive, sexy, cute, etc.) - ALWAYS return "dating".

Available categories:
- dating (знайомства: БУДЬ-ЯКА згадка людини, портрети, профільні фото, романтичний контекст, флірт, привабливість, красиві люди, dating додатки)
- nature (природа: пейзажі, тварини, рослини, погода - БЕЗ людей)
- architecture (архітектура: будівлі, інтер'єри, міста - БЕЗ людей)
- food (їжа: страви, напої, кулінарія - БЕЗ людей)
- technology (технології: гаджети, техніка, майбутнє - БЕЗ людей)
- art (мистецтво: живопис, графіка, ілюстрації - БЕЗ людей)
- abstract (абстракція: художні концепти, нереалістичне - БЕЗ людей)
- other (інше: все що не підходить під інші категорії)

IMPORTANT: Even single mention of person = dating category!

Return ONLY the category name in lowercase English, nothing else.`
      }, {
        role: 'user',
        content: `Content type: ${contentType}\nPrompt: ${prompt}`
      }],
      temperature: 0.3,
      max_tokens: 20
    });
    
    const category = response.choices[0].message.content.trim().toLowerCase();
    
    return {
      success: true,
      category: category
    };
  } catch (error) {
    console.error('Category detection error:', error);
    return {
      success: false,
      error: error.message,
      category: 'dating' // fallback to dating as priority
    };
  }
}

/**
 * Analyze comments using GPT-4o-mini
 */
export async function analyzeComments(comments) {
  try {
    if (!comments || comments.length === 0) {
      return {
        success: true,
        analysis: {
          likes: [],
          dislikes: [],
          suggestions: []
        }
      };
    }
    
    const commentsText = comments
      .filter(c => c && c.trim())
      .join('\n---\n');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `Analyze user comments about generated content.
Extract common themes, complaints, and preferences.

Output JSON format:
{
  "likes": ["keyword1", "keyword2", ...],
  "dislikes": ["keyword1", "keyword2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...]
}`
      }, {
        role: 'user',
        content: commentsText
      }],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });
    
    const analysis = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      analysis: {
        likes: analysis.likes || [],
        dislikes: analysis.dislikes || [],
        suggestions: analysis.suggestions || []
      }
    };
  } catch (error) {
    console.error('Comments analysis error:', error);
    return {
      success: false,
      error: error.message,
      analysis: { likes: [], dislikes: [], suggestions: [] }
    };
  }
}

export default {
  enhancePrompt,
  analyzeComments,
  detectCategory
};
