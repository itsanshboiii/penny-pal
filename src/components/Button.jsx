import React from 'react';
import '../styles/Button.css';

const Button = ({
  children,
  variant = 'default',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const buttonClasses = `
    btn 
    btn-${variant} 
    btn-${size} 
    ${fullWidth ? 'btn-full' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses.trim()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 