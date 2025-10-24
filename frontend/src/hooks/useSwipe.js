import { useState, useCallback } from 'react';
import { contentAPI, ratingsAPI } from '../services/api';

/**
 * Custom hook for swipe functionality
 */
export function useSwipe(userId) {
  const [currentContent, setCurrentContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [swipeStartTime, setSwipeStartTime] = useState(null);
  
  // Load next content
  const loadNext = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSwipeStartTime(Date.now());
    
    try {
      const excludeIds = swipeHistory.map(h => h.contentId);
      const response = await contentAPI.getRandom(userId, excludeIds);
      
      if (response.success && response.content) {
        setCurrentContent(response.content);
      } else {
        setError('No more content available');
        setCurrentContent(null);
      }
    } catch (err) {
      setError(err.message);
      setCurrentContent(null);
    } finally {
      setLoading(false);
    }
  }, [userId, swipeHistory]);
  
  // Handle swipe
  const handleSwipe = useCallback(async (direction, comment = null) => {
    if (!currentContent) return;
    
    const latencyMs = swipeStartTime ? Date.now() - swipeStartTime : null;
    
    try {
      const response = await ratingsAPI.create(
        currentContent.id,
        userId,
        direction,
        comment,
        latencyMs
      );
      
      if (response.success) {
        // Add to history
        setSwipeHistory(prev => [...prev, {
          contentId: currentContent.id,
          direction,
          comment,
          timestamp: new Date()
        }]);
        
        // Load next
        await loadNext();
        
        return { success: true, insightsUpdated: response.insightsUpdated };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [currentContent, userId, swipeStartTime, loadNext]);
  
  return {
    currentContent,
    loading,
    error,
    swipeHistory,
    loadNext,
    handleSwipe
  };
}

export default useSwipe;
