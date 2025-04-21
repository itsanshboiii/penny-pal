import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import '../styles/CurrencySelector.css';

const CurrencySelector = () => {
  const { currency, changeCurrency, isLoading, lastUpdated, refreshRates, error } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCurrencySelect = (currencyCode) => {
    console.log('Changing currency to:', currencyCode);
    changeCurrency(currencyCode);
    setIsOpen(false);
  };

  const handleRefreshRates = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    refreshRates();
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never updated';
    
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMs = now - updated;
    
    // Less than a minute
    if (diffMs < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // More than a day
    const days = Math.floor(diffMs / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="currency-selector" ref={dropdownRef}>
      <button 
        className={`currency-toggle ${isLoading ? 'loading' : ''}`}
        onClick={toggleDropdown} 
        disabled={isLoading}
        title="Select currency"
      >
        <span className="currency-symbol">{currency.symbol}</span>
      </button>
      
      {isOpen && (
        <div className="currency-dropdown">
          <div className="dropdown-header">
            <span className="last-updated">
              Updated: {formatLastUpdated()}
            </span>
            <button 
              className="refresh-button" 
              onClick={handleRefreshRates}
              disabled={isLoading}
              title="Refresh exchange rates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              Failed to load rates: {error}
            </div>
          )}
          
          {Object.keys(CURRENCIES).map((currencyCode) => (
            <button
              key={currencyCode}
              className={`currency-option ${currencyCode === currency.code ? 'active' : ''}`}
              onClick={() => handleCurrencySelect(currencyCode)}
            >
              <span className="currency-code">({currencyCode})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector; 