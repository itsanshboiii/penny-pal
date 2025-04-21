import React, { useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useExpenses } from '../context/ExpenseContext';
import { expenseCategories } from '../utils/categories';
import { categoryIcons } from '../utils/categoryIcons';
import { getCategoryColor } from '../utils/categories';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { expenses, budget, updateBudget } = useExpenses();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  // Calculate summary data for current month
  const summaryData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter expenses for current month
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
    
    // Calculate total expenses for current month
    const totalExpenses = currentMonthExpenses.reduce(
      (total, expense) => total + expense.amount, 
      0
    );
    
    // Calculate remaining budget
    const budgetRemaining = Math.max(0, budget - totalExpenses);
    
    // Calculate savings (for demonstration purposes, we'll use the remaining budget)
    const savings = budget > totalExpenses ? budget - totalExpenses : 0;

    // Get recent expenses (last 5)
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    return {
      totalExpenses,
      budgetRemaining,
      savings,
      recentExpenses
    };
  }, [expenses, budget]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle budget input change
  const handleBudgetChange = (e) => {
    setBudgetInput(e.target.value);
  };

  // Handle budget form submission
  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      updateBudget(newBudget);
      setIsEditingBudget(false);
    }
  };

  // Toggle budget edit mode
  const toggleBudgetEdit = () => {
    if (!isEditingBudget) {
      setBudgetInput(budget.toString());
    }
    setIsEditingBudget(!isEditingBudget);
  };

  return (
    <MainLayout>
      <div className="dashboard">
        <h2 className="dashboard-title">Dashboard</h2>
        
        <div className="dashboard-summary">
          <Card className="summary-card">
            <h3>Total Expenses</h3>
            <p className="summary-amount">{formatCurrency(summaryData.totalExpenses)}</p>
            <p className="summary-period">This Month</p>
          </Card>
          
          <Card className="summary-card">
            <div className="summary-header">
              <h3>Budget Remaining</h3>
              <button 
                className="edit-button" 
                onClick={toggleBudgetEdit} 
                aria-label="Edit budget"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
            
            {isEditingBudget ? (
              <form onSubmit={handleBudgetSubmit} className="budget-edit-form">
                <div className="budget-input-group">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={budgetInput}
                    onChange={handleBudgetChange}
                    className="budget-input"
                    autoFocus
                  />
                </div>
                <div className="budget-actions">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    onClick={toggleBudgetEdit} 
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="summary-amount">{formatCurrency(summaryData.budgetRemaining)}</p>
                <p className="summary-period">Monthly Budget: {formatCurrency(budget)}</p>
              </>
            )}
          </Card>
          
          <Card className="summary-card">
            <h3>Savings</h3>
            <p className="summary-amount">{formatCurrency(summaryData.savings)}</p>
            <p className="summary-period">This Month</p>
          </Card>
        </div>
        
        <div className="dashboard-actions">
          <Link to="/expenses/add" className="action-link">
            <Card className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3>Add Expense</h3>
              <p>Log a new expense item</p>
            </Card>
          </Link>
          
          <Link to="/expenses" className="action-link">
            <Card className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3>View Expenses</h3>
              <p>Manage your expenses</p>
            </Card>
          </Link>
          
          <Link to="/budgets" className="action-link">
            <Card className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>Manage Budgets</h3>
              <p>Set and track budgets</p>
            </Card>
          </Link>
          
          <Link to="/reports" className="action-link">
            <Card className="action-card">
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3>View Reports</h3>
              <p>Analyze your spending</p>
            </Card>
          </Link>
        </div>
        
        <div className="dashboard-recent">
          <div className="section-header">
            <h3>Recent Expenses</h3>
            <Link to="/expenses" className="view-all">View All</Link>
          </div>
          
          {summaryData.recentExpenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses yet. Start by adding your first expense.</p>
            </div>
          ) : (
            <Card className="recent-expenses-card">
              {summaryData.recentExpenses.map(expense => (
                <div key={expense.id} className="recent-expense-item">
                  <div className="recent-expense-left">
                    <div 
                      className="recent-expense-icon" 
                      style={{ 
                        backgroundColor: `${getCategoryColor(expense.category)}20`, 
                        color: getCategoryColor(expense.category) 
                      }}
                    >
                      {categoryIcons[expense.category]}
                    </div>
                    <div className="recent-expense-info">
                      <h4>{expense.title}</h4>
                      <div className="recent-expense-meta">
                        <span>{formatDate(expense.date)}</span>
                        <span className="recent-category">{expense.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="recent-expense-amount">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 