import React from 'react';
import '../styles/Card.css';

const Card = ({ 
  children, 
  className = '',
  interactive = false,
  bordered = false,
  ...props 
}) => {
  const classes = [
    'card',
    interactive && 'card-interactive',
    bordered && 'card-bordered',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 