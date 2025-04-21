import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="main-header">
      <div className="header-content">
        <nav className="main-nav">
          <Link to="/" className={location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/expenses" className={location.pathname.includes('/expenses') ? 'active' : ''}>
            Expenses
          </Link>
        </nav>
        
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 