import React, { useState, useRef, useEffect } from 'react';
import './SwipeCard.css';

const SwipeCard = ({ content, onSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef(null);

  // Reset card position
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [content]);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;

    const newX = clientX - startPos.x;
    const newY = clientY - startPos.y;
    
    setPosition({ x: newX, y: newY });
    setRotation(newX * 0.1); // Slight rotation based on horizontal movement
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    const { x, y } = position;

    // Determine swipe direction
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe
      if (x > threshold) {
        onSwipe('right'); // Like
      } else if (x < -threshold) {
        onSwipe('left'); // Reject
      } else {
        resetPosition();
      }
    } else {
      // Vertical swipe
      if (y < -threshold) {
        onSwipe('up'); // Superlike
      } else if (y > threshold) {
        onSwipe('down'); // Reroll
      } else {
        resetPosition();
      }
    }
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const getSwipeHint = () => {
    if (!position) return null;
    
    const threshold = 50;
    const { x, y } = position;

    if (Math.abs(x) > Math.abs(y)) {
      if (x > threshold) return { text: '👍 Like', className: 'positive' };
      if (x < -threshold) return { text: '👎 Reject', className: 'negative' };
    } else {
      if (y < -threshold) return { text: '⭐ Superlike', className: 'positive' };
      if (y > threshold) return { text: '🔄 Reroll', className: 'neutral' };
    }
    return null;
  };

  const swipeHint = getSwipeHint();

  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    opacity: isDragging ? 0.9 : 1,
  };

  if (!content) {
    return (
      <div className="swipe-container">
        <div className="empty-state">
          <p>🎉 No more content!</p>
          <p className="hint">You've reviewed everything available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-container">
      <div
        ref={cardRef}
        className={`swipe-card ${isDragging ? 'dragging' : ''}`}
        style={cardStyle}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => isDragging && handleEnd()}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => isDragging && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {/* Content Display */}
        <div className="card-content">
          {(content.media_type === 'image' || content.type === 'image') && content.url && (
            <img
              src={content.url}
              alt={content.prompt || content.original_prompt || 'Generated content'}
              className="card-image"
              draggable="false"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="card-text"><h3>Image failed to load</h3></div>';
              }}
            />
          )}
          {(content.media_type === 'video' || content.type === 'video') && content.url && (
            <video
              src={content.url}
              className="card-video"
              controls
              playsInline
              preload="metadata"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="card-text"><h3>Video failed to load</h3></div>';
              }}
            />
          )}
          {(content.media_type === 'audio' || content.type === 'audio') && content.url && (
            <div className="card-audio-container">
              <audio src={content.url} controls className="card-audio" preload="metadata" />
              <p className="audio-title">{content.prompt || content.original_prompt || 'Audio Content'}</p>
            </div>
          )}
          {(!content.url || !['image', 'video', 'audio'].includes(content.media_type || content.type)) && (
            <div className="card-text">
              <h3>{content.prompt || content.original_prompt || 'Content'}</h3>
              <p>Media type: {content.media_type || content.type || 'unknown'}</p>
              {content.model && <p className="card-model-info">Model: {content.model}</p>}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="card-info">
          <h3>{content.prompt || content.original_prompt || content.enhanced_prompt || 'Generated Content'}</h3>
          <div className="card-meta">
            <span className="card-type">{content.media_type || content.type || 'unknown'}</span>
            {content.model && <span className="card-model">{content.model}</span>}
          </div>
          {content.template_id && (
            <p className="card-template">Template: {content.template_id}</p>
          )}
        </div>

        {/* Swipe Hint Overlay */}
        {swipeHint && (
          <div className={`swipe-hint ${swipeHint.className}`}>
            {swipeHint.text}
          </div>
        )}
      </div>

      {/* Swipe Instructions */}
      <div className="swipe-instructions">
        <div className="instruction up">↑ Superlike</div>
        <div className="instruction right">→ Like</div>
        <div className="instruction down">↓ Reroll</div>
        <div className="instruction left">← Reject</div>
      </div>
    </div>
  );
};

export default SwipeCard;
