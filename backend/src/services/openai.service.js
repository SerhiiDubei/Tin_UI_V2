import OpenAI from 'openai';
import config from '../config/index.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

/**
 * Enhance prompt using GPT-4o
 */
export async function enhancePrompt(originalPrompt, context = {}) {
  try {
    const systemPrompt = context.systemInstructions || 
      'You are an expert prompt engineer. Improve the given prompt to generate better AI content. Make it detailed, specific, and optimized for image generation.';
    
    // Add insights if available
    let userMessage = originalPrompt;
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
      temperature: 0.7,
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
  analyzeComments
};
