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
      // Backend already filters out rated items (except skipped)
      // So we don't need to pass excludeIds from history
      const response = await contentAPI.getRandom(userId, []);
      
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
  }, [userId]);
  
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
        // Add to history - but skip/down items can be shown again
        setSwipeHistory(prev => [...prev, {
          contentId: currentContent.id,
          direction,
          comment,
          timestamp: new Date(),
          isSkipped: direction === 'down' // Mark as skipped
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
  
  // Get skipped items count
  const getSkippedCount = useCallback(() => {
    return swipeHistory.filter(h => h.isSkipped).length;
  }, [swipeHistory]);

  // Load specific skipped item
  const loadSkipped = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSwipeStartTime(Date.now());
    
    try {
      // Get IDs of skipped items
      const skippedIds = swipeHistory
        .filter(h => h.isSkipped)
        .map(h => h.contentId);
      
      if (skippedIds.length === 0) {
        setError('No skipped content');
        return;
      }
      
      // Get first skipped item
      const response = await contentAPI.getById(skippedIds[0]);
      
      if (response.success && response.data) {
        setCurrentContent(response.data);
      } else {
        setError('Failed to load skipped content');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [swipeHistory]);
  
  return {
    currentContent,
    loading,
    error,
    swipeHistory,
    loadNext,
    handleSwipe,
    getSkippedCount,
    loadSkipped
  };
}

export default useSwipe;
