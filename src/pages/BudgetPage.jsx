import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import '../styles/BudgetPage.css';

const BudgetPage = () => {
  const { categoryBudgets, updateCategoryBudget, expenses, budgetCurrency } = useExpenses();
  const currency = useCurrency();
  const [budgets, setBudgets] = useState([]);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budgeted: 0 });
  
  const navigate = useNavigate();
  
  // Update when currency changes
  useEffect(() => {
    console.log('Currency in BudgetPage changed to:', currency?.currency?.code);
    
    // Convert existing budget data to the current format
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Prepare budget data from context
    const budgetData = Object.entries(categoryBudgets).map(([category, amount]) => {
      // Calculate spent amount for this category in current month
      const spent = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expense.category === category && 
                 expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear;
        })
        .reduce((total, expense) => {
          // Convert to display currency if needed
          const convertedAmount = currency 
            ? currency.convertAmount(expense.amount, expense.currency || budgetCurrency)
            : expense.amount;
          return total + convertedAmount;
        }, 0);
      
      // Convert budget amount if needed
      let budgetAmount = amount;
      if (currency && budgetCurrency !== currency.currency.code) {
        budgetAmount = currency.convertAmount(amount, budgetCurrency);
      }
      
      return {
        id: category,
        category: category,
        budgeted: budgetAmount,
        spent: spent
      };
    }).filter(budget => budget.category && budget.budgeted > 0);
    
    setBudgets(budgetData);
  }, [expenses, categoryBudgets, currency, budgetCurrency]);
  
  useEffect(() => {
    // Calculate totals
    const budgetedSum = budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
    const spentSum = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    
    setTotalBudgeted(budgetedSum);
    setTotalSpent(spentSum);
  }, [budgets]);
  
  const handleAddBudget = () => {
    if (newBudget.category && newBudget.budgeted > 0) {
      // Convert from current currency to budget currency if needed
      let budgetAmount = Number(newBudget.budgeted);
      if (currency && currency.currency.code !== budgetCurrency) {
        // Convert display currency to budget currency for storage
        budgetAmount = currency.convertAmount(
          budgetAmount, 
          currency.currency.code, 
          budgetCurrency
        );
      }
      
      // Update the budget in context
      updateCategoryBudget(newBudget.category, budgetAmount);
      
      // Reset form
      setNewBudget({ category: '', budgeted: 0 });
      setShowAddForm(false);
    }
  };
  
  const handleUpdateBudget = (id, newAmount) => {
    // Convert from current currency to budget currency if needed
    let budgetAmount = Number(newAmount);
    if (currency && currency.currency.code !== budgetCurrency) {
      // Convert display currency to budget currency for storage
      budgetAmount = currency.convertAmount(
        budgetAmount, 
        currency.currency.code, 
        budgetCurrency
      );
    }
    
    // Update the budget in context
    updateCategoryBudget(id, budgetAmount);
  };
  
  const handleDeleteBudget = (id) => {
    // Set budget to 0 to effectively delete it
    updateCategoryBudget(id, 0);
  };
  
  const calculatePercentage = (spent, budgeted) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    if (currency) {
      return currency.formatAmount(amount);
    }
    return `$${amount.toFixed(2)}`;
  };
  
  // Get currency symbol
  const getCurrencySymbol = () => {
    if (currency) {
      return currency.currency.symbol;
    }
    return '$';
  };
  
  return (
    <MainLayout>
      <div className="budget-page">
        <h1 className="page-title">Budget Management</h1>
        
        <div className="budget-summary">
          <div className="summary-card">
            <h3>Total Budgeted</h3>
            <p className="amount">{formatCurrency(totalBudgeted)}</p>
          </div>
          
          <div className="summary-card">
            <h3>Total Spent</h3>
            <p className="amount">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="summary-card">
            <h3>Remaining</h3>
            <p className="amount">{formatCurrency(totalBudgeted - totalSpent)}</p>
          </div>
        </div>
        
        <div className="budget-controls">
          <button 
            className="add-budget-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Budget Category'}
          </button>
        </div>
        
        {showAddForm && (
          <div className="add-budget-form">
            <input
              type="text"
              placeholder="Category name"
              value={newBudget.category}
              onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
            />
            <div className="budget-input-group">
              <span className="currency-symbol">{getCurrencySymbol()}</span>
              <input
                type="number"
                placeholder="Budget amount"
                value={newBudget.budgeted}
                onChange={(e) => setNewBudget({...newBudget, budgeted: e.target.value})}
              />
            </div>
            <button onClick={handleAddBudget}>Add</button>
          </div>
        )}
        
        <div className="budget-list">
          {budgets.map(budget => (
            <div key={budget.id} className="budget-card">
              <div className="budget-card-header">
                <h3>{budget.category}</h3>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteBudget(budget.id)}
                >
                  Delete
                </button>
              </div>
              
              <div className="budget-amounts">
                <div className="budget-input-group">
                  <span>Budgeted: </span>
                  <span className="currency-symbol">{getCurrencySymbol()}</span>
                  <input
                    type="number"
                    value={budget.budgeted}
                    onChange={(e) => handleUpdateBudget(budget.id, e.target.value)}
                  />
                </div>
                <div>
                  <span>Spent: {formatCurrency(budget.spent)}</span>
                </div>
                <div>
                  <span>Remaining: {formatCurrency(budget.budgeted - budget.spent)}</span>
                </div>
              </div>
              
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${Math.min(calculatePercentage(budget.spent, budget.budgeted), 100)}%`,
                    backgroundColor: calculatePercentage(budget.spent, budget.budgeted) > 100 ? 'var(--error)' : 
                                    calculatePercentage(budget.spent, budget.budgeted) > 80 ? 'var(--warning)' : 
                                    'var(--emerald-primary)'
                  }}
                ></div>
              </div>
              <div className="progress-label">
                {calculatePercentage(budget.spent, budget.budgeted).toFixed(0)}% used
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default BudgetPage; 