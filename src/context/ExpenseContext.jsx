import React, { createContext, useContext, useState, useEffect } from 'react';
import { expenseCategories } from '../utils/categories';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(1000); // Default total budget amount
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [alerts, setAlerts] = useState([]);
  
  // Initialize default category budgets
  useEffect(() => {
    const defaultCategoryBudgets = {};
    expenseCategories.forEach(category => {
      defaultCategoryBudgets[category] = 0; // Default to 0 (no limit)
    });
    setCategoryBudgets(defaultCategoryBudgets);
  }, []);
  
  // Load expenses, budget, category budgets, and alerts from localStorage on initial load
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedBudget = localStorage.getItem('budget');
    const storedCategoryBudgets = localStorage.getItem('categoryBudgets');
    const storedAlerts = localStorage.getItem('alerts');
    
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
    
    if (storedBudget) {
      setBudget(parseFloat(storedBudget));
    }
    
    if (storedCategoryBudgets) {
      setCategoryBudgets(JSON.parse(storedCategoryBudgets));
    }

    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);
  
  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  // Save budget to localStorage whenever budget changes
  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  // Save category budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);
  
  // Check for budget alerts when expenses change
  useEffect(() => {
    checkBudgetAlerts();
  }, [expenses]);
  
  // Check for budget alerts
  const checkBudgetAlerts = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get current month expenses
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
    
    // Calculate total expenses for this month
    const totalExpenses = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount, 
      0
    );
    
    const newAlerts = [];
    
    // Check total budget
    if (totalExpenses > budget * 0.9 && totalExpenses < budget) {
      newAlerts.push({
        id: Date.now() + '-total-90',
        type: 'warning',
        message: `You've used 90% of your total monthly budget of ${budget.toFixed(2)}`,
        seen: false,
        timestamp: new Date().toISOString()
      });
    } else if (totalExpenses >= budget) {
      newAlerts.push({
        id: Date.now() + '-total-100',
        type: 'danger',
        message: `You've exceeded your total monthly budget of ${budget.toFixed(2)}`,
        seen: false,
        timestamp: new Date().toISOString()
      });
    }

    // Check category budgets
    const categoryTotals = {};
    
    // Calculate totals for each category
    currentMonthExpenses.forEach(expense => {
      const { category, amount } = expense;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    
    // Check each category against its budget
    Object.entries(categoryBudgets).forEach(([category, categoryBudget]) => {
      if (categoryBudget > 0) { // Only check categories with a budget set
        const categoryTotal = categoryTotals[category] || 0;
        
        if (categoryTotal > categoryBudget * 0.9 && categoryTotal < categoryBudget) {
          newAlerts.push({
            id: Date.now() + `-${category}-90`,
            type: 'warning',
            message: `You've used 90% of your budget for ${category} (${categoryBudget.toFixed(2)})`,
            seen: false,
            category,
            timestamp: new Date().toISOString()
          });
        } else if (categoryTotal >= categoryBudget) {
          newAlerts.push({
            id: Date.now() + `-${category}-100`,
            type: 'danger',
            message: `You've exceeded your budget for ${category} (${categoryBudget.toFixed(2)})`,
            seen: false,
            category,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
    
    // Add new alerts (avoid duplicates)
    if (newAlerts.length > 0) {
      const existingAlertMessages = alerts.map(alert => alert.message);
      const uniqueNewAlerts = newAlerts.filter(
        alert => !existingAlertMessages.includes(alert.message)
      );
      
      if (uniqueNewAlerts.length > 0) {
        setAlerts(prevAlerts => [...uniqueNewAlerts, ...prevAlerts]);
      }
    }
  };
  
  // Update budget amount
  const updateBudget = (newBudget) => {
    if (newBudget >= 0) {
      setBudget(newBudget);
    }
  };

  // Update category budget
  const updateCategoryBudget = (category, amount) => {
    if (amount >= 0 && expenseCategories.includes(category)) {
      setCategoryBudgets(prev => ({
        ...prev,
        [category]: amount
      }));
    }
  };

  // Mark alert as seen
  const markAlertAsSeen = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, seen: true } : alert
      )
    );
  };

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([]);
  };
  
  // Add new expense
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setExpenses([newExpense, ...expenses]);
    return newExpense;
  };
  
  // Update existing expense
  const updateExpense = (updatedExpense) => {
    setExpenses(
      expenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };
  
  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  // Get expense by ID
  const getExpenseById = (id) => {
    return expenses.find(expense => expense.id === id);
  };

  // Get category expenses for current month
  const getCategoryExpensesForMonth = (category) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expense.category === category && 
             expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  };

  // Get total expenses for current month
  const getTotalExpensesForMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
    
    return monthExpenses.reduce((total, expense) => total + expense.amount, 0);
  };
  
  return (
    <ExpenseContext.Provider value={{
      expenses,
      budget,
      categoryBudgets,
      alerts,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpenseById,
      updateBudget,
      updateCategoryBudget,
      markAlertAsSeen,
      clearAlerts,
      getCategoryExpensesForMonth,
      getTotalExpensesForMonth
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}; 