import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">Penny Pal</div>
          <nav className="footer-links">
            <a href="#about" className="footer-link">About</a>
            <a href="#features" className="footer-link">Features</a>
            <a href="#contact" className="footer-link">Contact</a>
          </nav>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Penny Pal - Smart Expense Tracker for Students
        </p>
      </div>
    </footer>
  );
};

export default Footer; 