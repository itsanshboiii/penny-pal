import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { expenseCategories } from '../utils/categories';
import { categoryIcons } from '../utils/categoryIcons';
import { useExpenses } from '../context/ExpenseContext';
import '../styles/ExpenseForm.css';

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { addExpense, updateExpense, getExpenseById } = useExpenses();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load expense data if editing
  useEffect(() => {
    if (isEditing && id) {
      const expenseToEdit = getExpenseById(id);
      if (expenseToEdit) {
        setFormData({
          ...expenseToEdit,
          date: expenseToEdit.date.split('T')[0], // Format date for input
          amount: expenseToEdit.amount.toString()
        });
      } else {
        // Expense not found, redirect to expenses list
        navigate('/expenses');
      }
    }
  }, [isEditing, id, getExpenseById, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category
    });
    
    // Clear category error if exists
    if (errors.category) {
      setErrors({
        ...errors,
        category: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Format expense data
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    try {
      // Save expense
      if (isEditing) {
        updateExpense(expenseData);
      } else {
        addExpense(expenseData);
      }
      
      // Navigate back to expenses list
      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error);
      // Handle error if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/expenses');
  };

  return (
    <MainLayout>
      <div className="expense-form-page">
        <Card className="expense-form-card">
          <div className="form-header">
            <h2>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                label="Title"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What did you spend on?"
                error={errors.title}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Amount ($)"
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  error={errors.amount}
                />
              </div>
              
              <div className="form-group">
                <Input
                  label="Date"
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="category-label">Category</label>
              <div className="category-selector">
                {expenseCategories.map((category) => (
                  <div 
                    key={category}
                    className={`category-option ${formData.category === category ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="category-icon">
                      {categoryIcons[category]}
                    </div>
                    <span>{category}</span>
                  </div>
                ))}
              </div>
              {errors.category && <p className="error-message">{errors.category}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Add more details about this expense..."
              ></textarea>
            </div>
            
            <div className="form-actions">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isEditing ? 'Update Expense' : 'Save Expense'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ExpenseForm; 