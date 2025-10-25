import express from 'express';
import { getUserInsights, updateUserInsights, updateTemplateInsights } from '../services/insights.service.js';
import supabase from '../db/supabase.js';

const router = express.Router();

/**
 * GET /api/insights/user/:userId
 * Get user insights
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const insights = await getUserInsights(userId);
    
    if (!insights) {
      return res.status(404).json({ error: 'User insights not found' });
    }
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Get user insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/insights/user/:userId/update
 * Manually trigger user insights update
 */
router.post('/user/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await updateUserInsights(userId);
    
    res.json(result);
  } catch (error) {
    console.error('Update user insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/template/:templateId
 * Get template insights
 */
router.get('/template/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('insights_json, avg_like_rate, total_uses')
      .eq('id', templateId)
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      insights: data
    });
  } catch (error) {
    console.error('Get template insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/insights/template/:templateId/update
 * Manually trigger template insights update
 */
router.post('/template/:templateId/update', async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const result = await updateTemplateInsights(templateId);
    
    res.json(result);
  } catch (error) {
    console.error('Update template insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/insights/dashboard
 * Get dashboard analytics
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Get overall stats
    const { data: contentCount } = await supabase
      .from('content')
      .select('id', { count: 'exact', head: true });
    
    const { data: ratingsCount } = await supabase
      .from('ratings')
      .select('id', { count: 'exact', head: true });
    
    const { data: ratings } = await supabase
      .from('ratings')
      .select('direction');
    
    const stats = {
      totalContent: contentCount?.length || 0,
      totalRatings: ratingsCount?.length || 0,
      likes: ratings?.filter(r => r.direction === 'right').length || 0,
      dislikes: ratings?.filter(r => r.direction === 'left').length || 0,
      superlikes: ratings?.filter(r => r.direction === 'up').length || 0
    };
    
    stats.likeRate = stats.totalRatings > 0
      ? ((stats.likes + stats.superlikes) / stats.totalRatings) * 100
      : 0;
    
    // Get top content
    const { data: topContent } = await supabase
      .from('content')
      .select('*')
      .gte('total_ratings', 5)
      .order('like_rate', { ascending: false })
      .limit(10);
    
    // Get active templates
    const { data: templates } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('active', true)
      .order('avg_like_rate', { ascending: false });
    
    res.json({
      success: true,
      data: {
        totalContent: stats.totalContent,
        totalRatings: stats.totalRatings,
        likeRate: stats.likeRate,
        stats,
        topContent: topContent || [],
        templates: templates || []
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
