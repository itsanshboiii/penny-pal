import React from 'react';
import '../styles/Input.css';

const Input = ({ 
  label,
  id,
  error,
  className = '',
  ...props 
}) => {
  const inputClasses = [
    'input',
    error && 'input-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {label && (
        <label 
          htmlFor={id} 
          className="input-label"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputClasses}
        {...props}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input; 