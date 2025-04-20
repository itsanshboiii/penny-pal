import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 