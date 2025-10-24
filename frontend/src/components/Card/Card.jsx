import React from 'react';
import './Card.css';

function Card({ 
  children, 
  title, 
  subtitle,
  footer,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props 
}) {
  const cardClass = [
    'custom-card',
    `card-${variant}`,
    hoverable && 'card-hoverable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
