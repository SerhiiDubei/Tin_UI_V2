import React, { useEffect, useState } from 'react';
import SwipeCard from '../components/SwipeCard';
import useSwipe from '../hooks/useSwipe';
import { useAuth } from '../contexts/AuthContext';
import './SwipePage.css';

function SwipePage() {
  const { user } = useAuth();
  const userId = user?.id || 'demo-user-123';
  const { currentContent, loading, error, swipeHistory, loadNext, handleSwipe } = useSwipe(userId);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [pendingDirection, setPendingDirection] = useState(null);
  
  useEffect(() => {
    loadNext();
  }, [loadNext]);
  
  const onSwipe = async (direction) => {
    if (direction === 'up' || direction === 'left') {
      // For superlike or dislike, ask for comment
      setPendingDirection(direction);
      setShowComment(true);
    } else {
      // For like or reroll, swipe immediately
      await handleSwipe(direction);
    }
  };
  
  const submitWithComment = async () => {
    if (pendingDirection) {
      await handleSwipe(pendingDirection, comment || null);
      setShowComment(false);
      setComment('');
      setPendingDirection(null);
    }
  };
  
  const skipComment = async () => {
    if (pendingDirection) {
      await handleSwipe(pendingDirection, null);
      setShowComment(false);
      setComment('');
      setPendingDirection(null);
    }
  };
  
  if (loading && !currentContent) {
    return (
      <div className="swipe-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="swipe-page">
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={loadNext}>Try Again</button>
        </div>
      </div>
    );
  }
  
  if (!currentContent) {
    return (
      <div className="swipe-page">
        <div className="empty-container">
          {swipeHistory.length === 0 ? (
            <>
              <p>🎭 No content available yet</p>
              <p>Generate some content first to start swiping!</p>
              <button 
                onClick={() => window.location.href = '/generate'}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: '#667eea'
                }}
              >
                Go to Generate Page →
              </button>
            </>
          ) : (
            <>
              <p>🎉 No more content to review!</p>
              <p>You've reviewed {swipeHistory.length} items.</p>
            </>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="swipe-page">
      <div className="header">
        <h1>🎯 AI Feedback Platform</h1>
        <div className="stats">
          <span>Reviewed: {swipeHistory.length}</span>
        </div>
      </div>
      
      <div className="swipe-container">
        <SwipeCard
          content={currentContent}
          onSwipe={onSwipe}
        />
      </div>
      
      <div className="instructions">
        <div className="instruction-item">
          <span className="arrow">←</span>
          <span>Reject</span>
        </div>
        <div className="instruction-item">
          <span className="arrow">→</span>
          <span>Like</span>
        </div>
        <div className="instruction-item">
          <span className="arrow">↑</span>
          <span>Superlike</span>
        </div>
        <div className="instruction-item">
          <span className="arrow">↓</span>
          <span>Reroll</span>
        </div>
      </div>
      
      {showComment && (
        <div className="comment-modal">
          <div className="comment-modal-content">
            <h3>💬 Add a comment (optional)</h3>
            <p>Help us understand what you {pendingDirection === 'up' ? 'loved' : 'didn\'t like'}</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your feedback here..."
              rows={4}
            />
            <div className="comment-modal-actions">
              <button className="btn-primary" onClick={submitWithComment}>
                Submit
              </button>
              <button className="btn-secondary" onClick={skipComment}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwipePage;
