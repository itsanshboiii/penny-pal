import React from 'react';
import '../styles/Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const classes = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    className
  ].join(' ');
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button; 