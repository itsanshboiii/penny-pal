import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(1000); // Default budget amount
  
  // Load expenses and budget from localStorage on initial load
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedBudget = localStorage.getItem('budget');
    
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
    
    if (storedBudget) {
      setBudget(parseFloat(storedBudget));
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
  
  // Update budget amount
  const updateBudget = (newBudget) => {
    if (newBudget >= 0) {
      setBudget(newBudget);
    }
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
  
  return (
    <ExpenseContext.Provider value={{
      expenses,
      budget,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpenseById,
      updateBudget
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}; 