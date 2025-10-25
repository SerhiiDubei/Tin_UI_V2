import express from 'express';
import supabase from '../db/supabase.js';
import { generateContent, batchGenerate } from '../services/replicate.service.js';
import { enhancePrompt, detectCategory } from '../services/openai.service.js';
import { getUserInsights } from '../services/insights.service.js';
import { getDefaultModel } from '../config/models.js';

const router = express.Router();

/**
 * POST /api/content/generate
 * Generate new content (single or batch)
 */
router.post('/generate', async (req, res) => {
  try {
    const { 
      prompt, 
      userId, 
      templateId, 
      contentType = 'image',
      modelKey,
      count = 1,
      customParams = {}
    } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Get template if provided
    let template = null;
    if (templateId) {
      const { data } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      template = data;
    }
    
    // Get user insights if userId provided
    let userInsights = null;
    if (userId) {
      userInsights = await getUserInsights(userId);
    }
    
    // Build context for enhancement
    const context = {
      systemInstructions: template?.system_instructions,
      insights: {
        likes: [
          ...(template?.insights_json?.likes || []),
          ...(userInsights?.likes_json || [])
        ],
        dislikes: [
          ...(template?.insights_json?.dislikes || []),
          ...(userInsights?.dislikes_json || [])
        ]
      }
    };
    
    // Enhance prompt with OpenAI
    const { enhancedPrompt } = await enhancePrompt(prompt, context);
    
    // Detect category automatically
    const { category } = await detectCategory(prompt, contentType);
    console.log(`📂 Detected category: ${category}`);
    
    // Determine model to use
    const selectedModel = modelKey || getDefaultModel(contentType);
    
    // Batch or single generation
    if (count > 1) {
      // Batch generation
      const batchResult = await batchGenerate(
        enhancedPrompt, 
        contentType, 
        selectedModel, 
        count,
        { ...template?.model_params, ...customParams }
      );
      
      if (!batchResult.success) {
        return res.status(500).json({ error: 'Batch generation failed', details: batchResult });
      }
      
      // Save all successful generations to database
      const contentToInsert = batchResult.results
        .filter(r => r.success)
        .map(r => ({
          url: r.url,
          type: contentType,
          original_prompt: prompt,
          enhanced_prompt: enhancedPrompt,
          model: r.model,
          template_id: templateId || null,
          user_id: userId || null,
          meta_json: { 
            ...template?.model_params, 
            ...customParams, 
            modelKey: selectedModel,
            contentType: contentType,
            category: category
          }
        }));
      
      const { data: savedContent, error: insertError } = await supabase
        .from('content')
        .insert(contentToInsert)
        .select();
      
      if (insertError) throw insertError;
      
      return res.json({
        success: true,
        batch: true,
        total: count,
        successful: batchResult.successful,
        failed: batchResult.failed,
        content: savedContent
      });
    } else {
      // Single generation
      const result = await generateContent(
        enhancedPrompt, 
        contentType, 
        selectedModel,
        { ...template?.model_params, ...customParams }
      );
      
      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }
      
      // Save to database
      const { data: content, error } = await supabase
        .from('content')
        .insert({
          url: result.url,
          type: contentType,
          original_prompt: prompt,
          enhanced_prompt: enhancedPrompt,
          model: result.model,
          template_id: templateId || null,
          user_id: userId || null,
          meta_json: { 
            ...template?.model_params, 
            ...customParams, 
            modelKey: selectedModel,
            contentType: contentType,
            category: category
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      res.json({
        success: true,
        content: content
      });
    }
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/content/:id
 * Get content by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, content: data });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/content
 * Get content list with filters
 */
router.get('/', async (req, res) => {
  try {
    const { 
      userId, 
      templateId, 
      type,
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      order = 'desc'
    } = req.query;
    
    let query = supabase
      .from('content')
      .select('*', { count: 'exact' });
    
    if (userId) query = query.eq('user_id', userId);
    if (templateId) query = query.eq('template_id', templateId);
    if (type) query = query.eq('type', type);
    
    query = query
      .order(sortBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      content: data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get content list error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/content/random
 * Get random content for swipe
 */
router.get('/random/next', async (req, res) => {
  try {
    const { userId, excludeIds = '' } = req.query;
    
    let query = supabase
      .from('content')
      .select('*');
    
    // Exclude already rated content
    if (excludeIds) {
      const ids = excludeIds.split(',');
      query = query.not('id', 'in', `(${ids.join(',')})`);
    }
    
    // Exclude user's own ratings if userId provided
    if (userId) {
      const { data: ratedIds } = await supabase
        .from('ratings')
        .select('content_id')
        .eq('user_id', userId);
      
      if (ratedIds && ratedIds.length > 0) {
        const ids = ratedIds.map(r => r.content_id);
        query = query.not('id', 'in', `(${ids.join(',')})`);
      }
    }
    
    // Get random (simple approach)
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.json({ success: false, message: 'No content available' });
    }
    
    // Pick random from top 10
    const randomContent = data[Math.floor(Math.random() * data.length)];
    
    res.json({
      success: true,
      content: randomContent
    });
  } catch (error) {
    console.error('Get random content error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
