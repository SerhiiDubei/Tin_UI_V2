import React from 'react';
import './Loading.css';

function Loading({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  variant = 'spinner'
}) {
  const containerClass = [
    'loading-container',
    fullScreen && 'loading-fullscreen'
  ].filter(Boolean).join(' ');

  const spinnerClass = [
    'loading-spinner',
    `spinner-${size}`,
    `spinner-${variant}`
  ].filter(Boolean).join(' ');

  if (variant === 'dots') {
    return (
      <div className={containerClass}>
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={containerClass}>
        <div className={spinnerClass}></div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default Loading;
