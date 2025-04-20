import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">Penny Pal</Link>
        <div className="header-right">
          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="#features" className="nav-link">Features</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 