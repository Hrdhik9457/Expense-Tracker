import React, { useState, useEffect } from 'react';

function ExpenseForm(props) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(function() {
    var item = props.editingExpense;
    if (item) {
      var d = item.date ? String(item.date).slice(0, 10) : '';
      setFormData({
        title: item.title || '',
        amount: item.amount || '',
        category: item.category || '',
        date: d
      });
      setErrorMessage('');
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: ''
      });
      setErrorMessage('');
    }
  }, [props.editingExpense]);

  function handleInputChange(evt) {
    var field = evt.target.name;
    var value = evt.target.value;
    setFormData(function(oldState) {
      var copy = Object.assign({}, oldState);
      copy[field] = value;
      return copy;
    });
  }

  function handleFormSubmit(evt) {
    evt.preventDefault();

    var titleVal = (formData.title || '').trim();
    var numAmount = parseFloat(formData.amount);

    if (titleVal.length === 0) {
      setErrorMessage('Title cannot be empty');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Amount must be positive number');
      return;
    }
    if (!formData.category) {
      setErrorMessage('Select a category');
      return;
    }
    if (!formData.date) {
      setErrorMessage('Select a date');
      return;
    }

    setErrorMessage('');

    props.onSubmit({
      title: titleVal,
      amount: numAmount,
      category: formData.category,
      date: formData.date
    }).then(function(ok) {
      if (ok && !props.editingExpense) {
        setFormData({
          title: '',
          amount: '',
          category: '',
          date: ''
        });
      }
    });
  }

  var isEditing = Boolean(props.editingExpense);

  return (
    <div className="card">
      <h2>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>

      {errorMessage.length > 0 && (
        <div style={{ color: '#dc3545', marginBottom: '14px', fontSize: '14px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Lunch, Groceries"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Amount (Rs.)</label>
            <input
              type="number"
              step="any"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">-- Choose Category --</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={props.loading}>
            {props.loading ? 'Saving...' : (isEditing ? 'Update Expense' : 'Add Expense')}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={props.onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
