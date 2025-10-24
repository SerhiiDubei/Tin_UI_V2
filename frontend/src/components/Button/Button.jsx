import React from 'react';
import './Button.css';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props 
}) {
  const buttonClass = [
    'custom-button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth && 'button-full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
