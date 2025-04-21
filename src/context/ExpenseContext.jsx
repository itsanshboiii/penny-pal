import React, { createContext, useContext, useState, useEffect } from 'react';
import { expenseCategories } from '../utils/categories';
import { useCurrency } from './CurrencyContext';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(1000); // Default total budget amount
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [budgetCurrency, setBudgetCurrency] = useState('USD');
  
  // Get currency context
  const currency = useCurrency ? useCurrency() : null;
  
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
    const storedBudgetCurrency = localStorage.getItem('budgetCurrency');
    
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
    
    if (storedBudgetCurrency) {
      setBudgetCurrency(storedBudgetCurrency);
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
  
  // Save budget currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetCurrency', budgetCurrency);
  }, [budgetCurrency]);
  
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
    
    // Calculate total expenses for this month, converting to budget currency if needed
    const totalExpenses = currentMonthExpenses.reduce(
      (sum, expense) => {
        const amount = currency ? 
          currency.convertAmount(expense.amount, expense.currency || budgetCurrency) : 
          expense.amount;
        return sum + amount;
      }, 
      0
    );
    
    const newAlerts = [];
    
    // Format budget value
    const formattedBudget = currency && currency.currency.code === budgetCurrency ? 
      currency.formatAmount(budget) : 
      `${budget.toFixed(2)} ${budgetCurrency}`;
    
    // Check total budget
    if (totalExpenses > budget * 0.9 && totalExpenses < budget) {
      newAlerts.push({
        id: Date.now() + '-total-90',
        type: 'warning',
        message: `You've used 90% of your total monthly budget of ${formattedBudget}`,
        seen: false,
        timestamp: new Date().toISOString()
      });
    } else if (totalExpenses >= budget) {
      newAlerts.push({
        id: Date.now() + '-total-100',
        type: 'danger',
        message: `You've exceeded your total monthly budget of ${formattedBudget}`,
        seen: false,
        timestamp: new Date().toISOString()
      });
    }

    // Check category budgets
    const categoryTotals = {};
    
    // Calculate totals for each category, converting currencies if needed
    currentMonthExpenses.forEach(expense => {
      const { category, amount, currency: expenseCurrency } = expense;
      const convertedAmount = currency ? 
        currency.convertAmount(amount, expenseCurrency || budgetCurrency) : 
        amount;
      categoryTotals[category] = (categoryTotals[category] || 0) + convertedAmount;
    });
    
    // Check each category against its budget
    Object.entries(categoryBudgets).forEach(([category, categoryBudget]) => {
      if (categoryBudget > 0) { // Only check categories with a budget set
        const categoryTotal = categoryTotals[category] || 0;
        
        // Format category budget value
        const formattedCategoryBudget = currency && currency.currency.code === budgetCurrency ? 
          currency.formatAmount(categoryBudget) : 
          `${categoryBudget.toFixed(2)} ${budgetCurrency}`;
        
        if (categoryTotal > categoryBudget * 0.9 && categoryTotal < categoryBudget) {
          newAlerts.push({
            id: Date.now() + `-${category}-90`,
            type: 'warning',
            message: `You've used 90% of your budget for ${category} (${formattedCategoryBudget})`,
            seen: false,
            category,
            timestamp: new Date().toISOString()
          });
        } else if (categoryTotal >= categoryBudget) {
          newAlerts.push({
            id: Date.now() + `-${category}-100`,
            type: 'danger',
            message: `You've exceeded your budget for ${category} (${formattedCategoryBudget})`,
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
  const updateBudget = (newBudget, currency) => {
    if (newBudget >= 0) {
      setBudget(newBudget);
      if (currency) {
        setBudgetCurrency(currency);
      }
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
      currency: expense.currency || (currency ? currency.currency.code : 'USD'),
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setExpenses([newExpense, ...expenses]);
    return newExpense;
  };
  
  // Update existing expense
  const updateExpense = (updatedExpense) => {
    // Ensure currency is set
    const expenseWithCurrency = {
      ...updatedExpense,
      currency: updatedExpense.currency || (currency ? currency.currency.code : 'USD')
    };
    
    setExpenses(
      expenses.map(expense => 
        expense.id === updatedExpense.id ? expenseWithCurrency : expense
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
    
    return monthExpenses.reduce((total, expense) => {
      // Convert to display currency if needed
      const amount = currency ? 
        currency.convertAmount(expense.amount, expense.currency || budgetCurrency) : 
        expense.amount;
      return total + amount;
    }, 0);
  };
  
  // Get budget currency
  const getBudgetCurrency = () => {
    return budgetCurrency;
  };
  
  // Change budget currency
  const changeBudgetCurrency = (newCurrency) => {
    if (currency && currency.currencies[newCurrency]) {
      // Convert budget amount to new currency
      const newBudgetAmount = currency.convertAmount(budget, budgetCurrency);
      setBudget(newBudgetAmount);
      setBudgetCurrency(newCurrency);
      
      // Convert category budgets
      const newCategoryBudgets = {};
      Object.entries(categoryBudgets).forEach(([category, amount]) => {
        if (amount > 0) {
          newCategoryBudgets[category] = currency.convertAmount(amount, budgetCurrency);
        } else {
          newCategoryBudgets[category] = 0;
        }
      });
      setCategoryBudgets(newCategoryBudgets);
    }
  };
  
  const value = {
    expenses,
    budget,
    budgetCurrency,
    categoryBudgets,
    alerts,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    updateBudget,
    updateCategoryBudget,
    getCategoryExpensesForMonth,
    getTotalExpensesForMonth,
    markAlertAsSeen,
    clearAlerts,
    getBudgetCurrency,
    changeBudgetCurrency
  };
  
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}; 