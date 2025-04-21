import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Penny Pal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 