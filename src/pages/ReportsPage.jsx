import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import { useExpenses } from '../context/ExpenseContext';
import { useCurrency } from '../context/CurrencyContext';
import { expenseCategories, categoryColors } from '../utils/categories';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import '../styles/ReportsPage.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const { expenses, budgetCurrency } = useExpenses();
  const currency = useCurrency();
  const [dateRange, setDateRange] = useState('month'); // 'month', 'quarter', 'year'
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Force update when currency changes
  useEffect(() => {
    console.log('Currency in ReportsPage changed to:', currency?.currency?.code);
  }, [currency, currency?.currency?.code]);
  
  // Get filtered expenses based on date range
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      if (dateRange === 'month') {
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      } else if (dateRange === 'quarter') {
        const currentQuarter = Math.floor(currentMonth / 3);
        const expenseQuarter = Math.floor(expenseDate.getMonth() / 3);
        return expenseQuarter === currentQuarter && 
               expenseDate.getFullYear() === currentYear;
      } else if (dateRange === 'year') {
        return expenseDate.getFullYear() === currentYear;
      }
      return true;
    });
  }, [expenses, dateRange]);
  
  // Get expenses filtered by selected category
  const categoryFilteredExpenses = useMemo(() => {
    if (selectedCategory === 'all') {
      return filteredExpenses;
    }
    return filteredExpenses.filter(expense => expense.category === selectedCategory);
  }, [filteredExpenses, selectedCategory]);
  
  // Helper to convert expense amount to current currency
  const convertExpenseAmount = (expense) => {
    if (currency) {
      return currency.convertAmount(expense.amount, expense.currency || budgetCurrency);
    }
    return expense.amount;
  };
  
  // Calculate category totals for pie chart
  const categoryData = useMemo(() => {
    const totals = {};
    
    expenseCategories.forEach(category => {
      totals[category] = 0;
    });
    
    filteredExpenses.forEach(expense => {
      // Convert to current currency
      const convertedAmount = convertExpenseAmount(expense);
      totals[expense.category] = (totals[expense.category] || 0) + convertedAmount;
    });
    
    return {
      labels: Object.keys(totals).filter(category => totals[category] > 0),
      datasets: [
        {
          data: Object.values(totals).filter(amount => amount > 0),
          backgroundColor: Object.keys(totals)
            .filter(category => totals[category] > 0)
            .map(category => categoryColors[category]),
          borderWidth: 1,
        },
      ],
    };
  }, [filteredExpenses, currency, budgetCurrency]);
  
  // Calculate monthly spending for line chart
  const monthlySpendingData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Initialize monthly totals
    const monthlyTotals = Array(12).fill(0);
    
    // Sum expenses by month
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === currentYear) {
        const month = expenseDate.getMonth();
        // Convert to current currency
        const convertedAmount = convertExpenseAmount(expense);
        monthlyTotals[month] += convertedAmount;
      }
    });
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Monthly Spending',
          data: monthlyTotals,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3,
        },
      ],
    };
  }, [expenses, currency, budgetCurrency]);
  
  // Calculate weekly spending for bar chart
  const weeklySpendingData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Group expenses by week
    const weeklyExpenses = {};
    
    // Only look at this month's expenses
    const thisMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
    
    // Group by week
    thisMonthExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const weekNumber = Math.ceil(expenseDate.getDate() / 7);
      // Convert to current currency
      const convertedAmount = convertExpenseAmount(expense);
      weeklyExpenses[weekNumber] = (weeklyExpenses[weekNumber] || 0) + convertedAmount;
    });
    
    // Create array of weekly totals
    const weeklyTotals = [1, 2, 3, 4, 5].map(week => weeklyExpenses[week] || 0);
    
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [
        {
          label: 'Weekly Spending',
          data: weeklyTotals,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
        },
      ],
    };
  }, [expenses, currency, budgetCurrency]);
  
  // Format currency
  const formatCurrency = (amount) => {
    if (currency) {
      return currency.formatAmount(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate total amount spent in selected period
  const totalSpent = useMemo(() => {
    return categoryFilteredExpenses.reduce((total, expense) => {
      // Convert to current currency
      const convertedAmount = convertExpenseAmount(expense);
      return total + convertedAmount;
    }, 0);
  }, [categoryFilteredExpenses, currency, budgetCurrency]);
  
  // Calculate average expense amount
  const averageExpense = useMemo(() => {
    if (categoryFilteredExpenses.length === 0) return 0;
    return totalSpent / categoryFilteredExpenses.length;
  }, [categoryFilteredExpenses, totalSpent]);
  
  // Find highest expense
  const highestExpense = useMemo(() => {
    if (categoryFilteredExpenses.length === 0) return { amount: 0 };
    
    // Convert all expenses to current currency for comparison
    const convertedExpenses = categoryFilteredExpenses.map(expense => ({
      ...expense,
      convertedAmount: convertExpenseAmount(expense)
    }));
    
    return convertedExpenses.reduce(
      (max, expense) => expense.convertedAmount > max.convertedAmount ? expense : max, 
      { convertedAmount: 0 }
    );
  }, [categoryFilteredExpenses, currency, budgetCurrency]);
  
  // Get spending by day of week
  const spendingByDayOfWeek = useMemo(() => {
    const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    categoryFilteredExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const dayOfWeek = expenseDate.getDay(); // 0 is Sunday, 6 is Saturday
      // Convert to current currency
      const convertedAmount = convertExpenseAmount(expense);
      dayTotals[dayOfWeek] += convertedAmount;
    });
    
    return {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Spending by Day of Week',
          data: dayTotals,
          backgroundColor: 'rgba(14, 165, 233, 0.7)',
        },
      ],
    };
  }, [categoryFilteredExpenses, currency, budgetCurrency]);
  
  return (
    <MainLayout>
      <div className="reports-page">
        <h2 className="page-title">Reports & Insights</h2>
        
        <div className="report-filters">
          <div className="filter-group">
            <label htmlFor="date-range">Date Range:</label>
            <select 
              id="date-range" 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select 
              id="category-filter" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {expenseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="summary-metrics">
          <Card className="metric-card">
            <h3>Total Spent</h3>
            <p className="metric-value">{formatCurrency(totalSpent)}</p>
            <p className="metric-label">{dateRange === 'month' ? 'This Month' : dateRange === 'quarter' ? 'This Quarter' : 'This Year'}</p>
          </Card>
          
          <Card className="metric-card">
            <h3>Average Expense</h3>
            <p className="metric-value">{formatCurrency(averageExpense)}</p>
            <p className="metric-label">{categoryFilteredExpenses.length} Transactions</p>
          </Card>
          
          <Card className="metric-card">
            <h3>Highest Expense</h3>
            <p className="metric-value">{formatCurrency(highestExpense.convertedAmount || highestExpense.amount)}</p>
            <p className="metric-label">{highestExpense.title || 'None'}</p>
          </Card>
        </div>
        
        <div className="charts-grid">
          <Card className="chart-card">
            <h3>Spending by Category</h3>
            <div className="chart-container pie-chart">
              {categoryData.labels.length > 0 ? (
                <Pie 
                  data={categoryData} 
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 15,
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-data">No data available</div>
              )}
            </div>
          </Card>
          
          <Card className="chart-card">
            <h3>Monthly Spending Trend</h3>
            <div className="chart-container">
              <Line 
                data={monthlySpendingData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value)
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
          
          <Card className="chart-card">
            <h3>Weekly Spending (This Month)</h3>
            <div className="chart-container">
              <Bar 
                data={weeklySpendingData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value)
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
          
          <Card className="chart-card">
            <h3>Spending by Day of Week</h3>
            <div className="chart-container">
              <Bar 
                data={spendingByDayOfWeek} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value)
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </div>
        
        <Card className="expense-table-card">
          <h3>Recent Transactions</h3>
          
          {categoryFilteredExpenses.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found for the selected filters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryFilteredExpenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10)
                    .map(expense => (
                      <tr key={expense.id}>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.title}</td>
                        <td>{expense.category}</td>
                        <td className="amount-column">{formatCurrency(expense.amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReportsPage; 