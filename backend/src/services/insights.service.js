import supabase from '../db/supabase.js';
import { analyzeComments } from './openai.service.js';

/**
 * Get user insights
 */
export async function getUserInsights(userId) {
  try {
    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found is OK
      throw error;
    }
    
    return data || {
      user_id: userId,
      likes_json: [],
      dislikes_json: [],
      total_swipes: 0
    };
  } catch (error) {
    console.error('Get user insights error:', error);
    return null;
  }
}

/**
 * Update user insights after swipes
 */
export async function updateUserInsights(userId) {
  try {
    console.log(`🔄 Updating insights for user: ${userId}`);
    
    // Get recent ratings (last 50)
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('direction, comment')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (ratingsError) throw ratingsError;
    
    if (!ratings || ratings.length === 0) {
      console.log('⚠️ No ratings found for user');
      return { success: false, message: 'No ratings found' };
    }
    
    console.log(`📊 Found ${ratings.length} ratings`);
    
    // Separate by direction
    const likes = ratings.filter(r => r.direction === 'right' || r.direction === 'up');
    const dislikes = ratings.filter(r => r.direction === 'left');
    
    // Analyze comments
    const likeComments = likes.map(r => r.comment).filter(c => c);
    const dislikeComments = dislikes.map(r => r.comment).filter(c => c);
    
    console.log(`💬 Analyzing ${likeComments.length} like comments and ${dislikeComments.length} dislike comments`);
    
    const likeAnalysis = await analyzeComments(likeComments);
    const dislikeAnalysis = await analyzeComments(dislikeComments);
    
    // Count keywords
    const likesKeywords = countKeywords(likeAnalysis.analysis.likes);
    const dislikesKeywords = countKeywords(dislikeAnalysis.analysis.dislikes);
    
    console.log(`✅ Keywords - Likes: ${likesKeywords.length}, Dislikes: ${dislikesKeywords.length}`);
    
    // Combine suggestions from both analyses
    const allSuggestions = [
      ...(likeAnalysis.analysis.suggestions || []),
      ...(dislikeAnalysis.analysis.suggestions || [])
    ];
    
    // Calculate stats
    const totalSwipes = ratings.length;
    const totalLikes = likes.length;
    const totalDislikes = dislikes.length;
    const totalSuperlikes = ratings.filter(r => r.direction === 'up').length;
    
    // Upsert insights
    const { data, error } = await supabase
      .from('user_insights')
      .upsert({
        user_id: userId,
        likes_json: likesKeywords,
        dislikes_json: dislikesKeywords,
        preferences_json: {
          suggestions: allSuggestions
        },
        total_swipes: totalSwipes,
        total_likes: totalLikes,
        total_dislikes: totalDislikes,
        total_superlikes: totalSuperlikes,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ Insights updated successfully:', {
      likes: likesKeywords.slice(0, 3),
      dislikes: dislikesKeywords.slice(0, 3),
      suggestions: allSuggestions.slice(0, 3)
    });
    
    return {
      success: true,
      insights: data
    };
  } catch (error) {
    console.error('Update user insights error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update template insights
 */
export async function updateTemplateInsights(templateId) {
  try {
    // Get all content for this template
    const { data: contentItems, error: contentError } = await supabase
      .from('content')
      .select('id')
      .eq('template_id', templateId);
    
    if (contentError) throw contentError;
    
    if (!contentItems || contentItems.length === 0) {
      return { success: false, message: 'No content found' };
    }
    
    const contentIds = contentItems.map(c => c.id);
    
    // Get all ratings for this content
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('direction, comment')
      .in('content_id', contentIds);
    
    if (ratingsError) throw ratingsError;
    
    if (!ratings || ratings.length === 0) {
      return { success: false, message: 'No ratings found' };
    }
    
    // Analyze
    const likes = ratings.filter(r => r.direction === 'right' || r.direction === 'up');
    const dislikes = ratings.filter(r => r.direction === 'left');
    
    const likeComments = likes.map(r => r.comment).filter(c => c);
    const dislikeComments = dislikes.map(r => r.comment).filter(c => c);
    
    const likeAnalysis = await analyzeComments(likeComments);
    const dislikeAnalysis = await analyzeComments(dislikeComments);
    
    const likesKeywords = countKeywords(likeAnalysis.analysis.likes);
    const dislikesKeywords = countKeywords(dislikeAnalysis.analysis.dislikes);
    
    // Calculate like rate
    const totalRatings = ratings.length;
    const totalLikes = likes.length;
    const avgLikeRate = totalLikes / totalRatings;
    
    // Update template
    const { data, error } = await supabase
      .from('prompt_templates')
      .update({
        insights_json: {
          likes: likesKeywords,
          dislikes: dislikesKeywords
        },
        total_uses: contentItems.length,
        avg_like_rate: avgLikeRate,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      template: data
    };
  } catch (error) {
    console.error('Update template insights error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Helper: Count keywords with frequency
 */
function countKeywords(keywords) {
  const counts = {};
  
  keywords.forEach(keyword => {
    const key = keyword.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  
  return Object.entries(counts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count);
}

export default {
  getUserInsights,
  updateUserInsights,
  updateTemplateInsights
};
