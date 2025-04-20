import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <MainLayout>
      <section className="hero-section">
        <h2>Smart Expense Tracking for Students</h2>
        <p>
          Take control of your finances with our easy-to-use expense tracker designed specifically for college students.
        </p>
        <div className="hero-buttons">
          <Button variant="primary" size="lg">Get Started</Button>
          <Button variant="secondary" size="lg">Learn More</Button>
        </div>
      </section>

      <div className="section-title">
        <h3>Key Features</h3>
        <p>Everything you need to manage your finances effectively as a student</p>
      </div>

      <section id="features" className="grid-features">
        <Card className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h4>Expense Tracking</h4>
          <p>Easily log your expenses and categorize them to keep track of where your money is going.</p>
        </Card>

        <Card className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h4>Reports & Insights</h4>
          <p>Visualize your spending patterns with easy-to-understand charts and reports.</p>
        </Card>

        <Card className="feature-card">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4>Rewards System</h4>
          <p>Earn virtual rewards for meeting your savings goals and developing good financial habits.</p>
        </Card>
      </section>
    </MainLayout>
  );
};

export default LandingPage;