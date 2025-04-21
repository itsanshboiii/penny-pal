import React, { useState, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { expenseCategories } from '../utils/categories';
import { categoryIcons } from '../utils/categoryIcons';
import { getCategoryColor } from '../utils/categories';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import '../styles/Expenses.css';

const Expenses = () => {
  const { expenses, deleteExpense } = useExpenses();
  const currency = useCurrency();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle delete expense
  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  // Filter and search expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filter by category
      const matchesCategory = filter === 'all' || 
        expense.category.toLowerCase().replace(/\s+/g, '-') === filter;
      
      // Filter by search term
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [expenses, filter, searchTerm]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Force re-render when currency changes
  React.useEffect(() => {
    console.log('Currency changed in Expenses page:', currency?.currency?.code);
    // This effect will run whenever the currency context changes
  }, [currency, currency?.currency?.code]);

  // Format amount with currency
  const formatAmount = (amount, expenseCurrency = 'USD') => {
    if (!currency) return `$${amount.toFixed(2)}`;
    
    try {
      console.log(`Converting ${amount} ${expenseCurrency} to ${currency.currency.code}`);
      // Convert amount if the expense currency is different from the display currency
      const convertedAmount = currency.convertAmount(amount, expenseCurrency);
      return currency.formatAmount(convertedAmount);
    } catch (err) {
      console.error('Error formatting amount:', err);
      // Fallback if conversion fails
      const currencySymbol = CURRENCIES[expenseCurrency]?.symbol || '$';
      return `${currencySymbol}${amount.toFixed(2)}`;
    }
  };

  return (
    <MainLayout>
      <div className="expenses-page">
        <div className="expenses-header">
          <h2>Expenses</h2>
          <Link to="/expenses/add">
            <Button variant="primary">Add Expense</Button>
          </Link>
        </div>

        <Card className="expenses-filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select 
              id="category-filter" 
              value={filter} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {expenseCategories.map(category => (
                <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="expense-search">Search</label>
            <div className="search-input">
              <input
                id="expense-search"
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {filteredExpenses.length === 0 ? (
          <div className="empty-expenses">
            <div className="empty-illustration">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>No expenses found</h3>
            <p>
              {expenses.length === 0 
                ? "Start adding your expenses to track where your money goes." 
                : "No expenses match your current filters."}
            </p>
            {expenses.length === 0 && (
              <Link to="/expenses/add">
                <Button variant="primary">Add Your First Expense</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="expenses-list">
            <Card>
              {filteredExpenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-details">
                    <div 
                      className="expense-category" 
                      style={{ backgroundColor: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}
                    >
                      {categoryIcons[expense.category]}
                    </div>
                    <div className="expense-info">
                      <h4>{expense.title}</h4>
                      <div className="expense-meta">
                        <span>{formatDate(expense.date)}</span>
                        <span className="category-tag">{expense.category}</span>
                        {expense.currency && currency && expense.currency !== currency.currency.code && (
                          <span className="currency-tag">
                            {CURRENCIES[expense.currency]?.symbol} {expense.currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="expense-amount-actions">
                    <div className="expense-amount">
                      {formatAmount(expense.amount, expense.currency)}
                    </div>
                    <div className="expense-actions">
                      <Link to={`/expenses/edit/${expense.id}`} className="action-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </Link>
                      <button 
                        className="action-button delete-button" 
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Expenses; 