import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import { ExpenseProvider } from './context/ExpenseContext';
import { CurrencyProvider } from './context/CurrencyContext';
import './styles/variables.css';
import './styles/App.css';

function App() {
  return (
    <CurrencyProvider>
      <ExpenseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/add" element={<ExpenseForm />} />
            <Route path="/expenses/edit/:id" element={<ExpenseForm />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ExpenseProvider>
    </CurrencyProvider>
  );
}

export default App;
