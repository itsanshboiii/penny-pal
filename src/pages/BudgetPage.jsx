import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import '../styles/BudgetPage.css';

// Mock budget data - replace with actual data from your context or API
const initialBudgets = [
  { id: 1, category: 'Food', budgeted: 500, spent: 350 },
  { id: 2, category: 'Transportation', budgeted: 200, spent: 180 },
  { id: 3, category: 'Entertainment', budgeted: 150, spent: 75 },
  { id: 4, category: 'Utilities', budgeted: 300, spent: 290 },
];

const BudgetPage = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budgeted: 0 });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Calculate totals
    const budgetedSum = budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
    const spentSum = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    
    setTotalBudgeted(budgetedSum);
    setTotalSpent(spentSum);
  }, [budgets]);
  
  const handleAddBudget = () => {
    if (newBudget.category && newBudget.budgeted > 0) {
      const updatedBudgets = [
        ...budgets,
        {
          id: Date.now(), // Simple ID generation
          category: newBudget.category,
          budgeted: Number(newBudget.budgeted),
          spent: 0,
        },
      ];
      
      setBudgets(updatedBudgets);
      setNewBudget({ category: '', budgeted: 0 });
      setShowAddForm(false);
    }
  };
  
  const handleUpdateBudget = (id, newAmount) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === id ? { ...budget, budgeted: Number(newAmount) } : budget
    );
    setBudgets(updatedBudgets);
  };
  
  const handleDeleteBudget = (id) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
  };
  
  const calculatePercentage = (spent, budgeted) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0;
  };
  
  return (
    <MainLayout>
      <div className="budget-page">
        <h1 className="page-title">Budget Management</h1>
        
        <div className="budget-summary">
          <div className="summary-card">
            <h3>Total Budgeted</h3>
            <p className="amount">${totalBudgeted.toFixed(2)}</p>
          </div>
          
          <div className="summary-card">
            <h3>Total Spent</h3>
            <p className="amount">${totalSpent.toFixed(2)}</p>
          </div>
          
          <div className="summary-card">
            <h3>Remaining</h3>
            <p className="amount">${(totalBudgeted - totalSpent).toFixed(2)}</p>
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
            <input
              type="number"
              placeholder="Budget amount"
              value={newBudget.budgeted}
              onChange={(e) => setNewBudget({...newBudget, budgeted: e.target.value})}
            />
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
                <div>
                  <span>Budgeted: </span>
                  <input
                    type="number"
                    value={budget.budgeted}
                    onChange={(e) => handleUpdateBudget(budget.id, e.target.value)}
                  />
                </div>
                <div>
                  <span>Spent: ${budget.spent.toFixed(2)}</span>
                </div>
                <div>
                  <span>Remaining: ${(budget.budgeted - budget.spent).toFixed(2)}</span>
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