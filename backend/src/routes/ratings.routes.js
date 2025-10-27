import express from 'express';
import supabase from '../db/supabase.js';
import { updateUserInsights, updateTemplateInsights } from '../services/insights.service.js';

const router = express.Router();

/**
 * POST /api/ratings
 * Create a new rating (swipe)
 */
router.post('/', async (req, res) => {
  try {
    const { 
      contentId, 
      userId, 
      direction, 
      comment = null,
      latencyMs = null,
      userWeight = 1.0
    } = req.body;
    
    if (!contentId || !userId || !direction) {
      return res.status(400).json({ 
        error: 'contentId, userId, and direction are required' 
      });
    }
    
    if (!['left', 'right', 'up', 'down'].includes(direction)) {
      return res.status(400).json({ 
        error: 'Invalid direction. Must be: left, right, up, or down' 
      });
    }
    
    // Check if already rated (but allow re-rating skipped items)
    const { data: existing } = await supabase
      .from('ratings')
      .select('id, direction')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();
    
    if (existing) {
      // If was skipped, allow re-rating (update instead of error)
      if (existing.direction === 'down') {
        console.log(`🔄 Updating skipped item to ${direction}`);
        const { data: updated, error: updateError } = await supabase
          .from('ratings')
          .update({
            direction: direction,
            comment: comment,
            latency_ms: latencyMs,
            meta_json: {
              updated_from_skip: true,
              timestamp: new Date().toISOString()
            }
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        
        return res.json({
          success: true,
          rating: updated,
          updated: true
        });
      } else {
        return res.status(409).json({ 
          error: 'Content already rated by this user' 
        });
      }
    }
    
    // Get content info for metadata
    const { data: content } = await supabase
      .from('content')
      .select('type, model, template_id')
      .eq('id', contentId)
      .single();
    
    // Create rating with metadata
    const { data: rating, error } = await supabase
      .from('ratings')
      .insert({
        content_id: contentId,
        user_id: userId,
        direction: direction,
        comment: comment,
        latency_ms: latencyMs,
        user_weight: userWeight,
        meta_json: {
          content_type: content?.type || 'unknown',
          content_model: content?.model || 'unknown',
          template_id: content?.template_id || null,
          timestamp: new Date().toISOString(),
          swipe_session: Date.now()
        }
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Check if we should update insights (every 10 swipes)
    const { data: userRatings } = await supabase
      .from('ratings')
      .select('id')
      .eq('user_id', userId);
    
    const shouldUpdateInsights = userRatings && userRatings.length % 10 === 0;
    
    if (shouldUpdateInsights) {
      // Update in background (don't wait)
      updateUserInsights(userId).catch(err => {
        console.error('Background insights update error:', err);
      });
      
      // Also update template insights if content has template
      const { data: content } = await supabase
        .from('content')
        .select('template_id')
        .eq('id', contentId)
        .single();
      
      if (content?.template_id) {
        updateTemplateInsights(content.template_id).catch(err => {
          console.error('Background template insights update error:', err);
        });
      }
    }
    
    res.json({
      success: true,
      rating: rating,
      insightsUpdated: shouldUpdateInsights
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ratings
 * Get ratings list
 */
router.get('/', async (req, res) => {
  try {
    const { userId, contentId, direction, limit = 50 } = req.query;
    
    let query = supabase
      .from('ratings')
      .select('*, content(*)')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));
    
    if (userId) query = query.eq('user_id', userId);
    if (contentId) query = query.eq('content_id', contentId);
    if (direction) query = query.eq('direction', direction);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      ratings: data
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ratings/stats
 * Get rating statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const { userId, contentId } = req.query;
    
    let query = supabase
      .from('ratings')
      .select('direction');
    
    if (userId) query = query.eq('user_id', userId);
    if (contentId) query = query.eq('content_id', contentId);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const stats = {
      total: data.length,
      likes: data.filter(r => r.direction === 'right').length,
      dislikes: data.filter(r => r.direction === 'left').length,
      superlikes: data.filter(r => r.direction === 'up').length,
      rerolls: data.filter(r => r.direction === 'down').length
    };
    
    stats.likeRate = stats.total > 0 
      ? ((stats.likes + stats.superlikes) / stats.total) * 100
      : 0;
    
    // Also add individual counts for easier use
    stats.totalRatings = stats.total;
    stats.totalLikes = stats.likes + stats.superlikes;
    stats.totalDislikes = stats.dislikes;
    
    // Calculate unrated content if userId provided
    if (userId) {
      // Get total content count
      const { count: totalContent } = await supabase
        .from('content')
        .select('*', { count: 'exact', head: true });
      
      // Get rated content count (excluding skipped)
      const { count: ratedCount } = await supabase
        .from('ratings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('direction', 'down'); // Exclude skipped
      
      stats.totalContent = totalContent || 0;
      stats.unrated = (totalContent || 0) - (ratedCount || 0);
      
      console.log(`📊 Stats for user ${userId}:`, {
        totalContent,
        ratedCount,
        unrated: stats.unrated
      });
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get rating stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
