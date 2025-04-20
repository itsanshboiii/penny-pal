import React from 'react';
import '../styles/Card.css';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 