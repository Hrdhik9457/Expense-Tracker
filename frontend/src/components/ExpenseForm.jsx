import React, { useState, useEffect } from 'react';

function ExpenseForm(props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (props.editingExpense) {
      setTitle(props.editingExpense.title || '');
      setAmount(props.editingExpense.amount || '');
      setCategory(props.editingExpense.category || '');
      
      if (props.editingExpense.date) {
        var d = new Date(props.editingExpense.date);
        var formattedDate = d.toISOString().substring(0, 10);
        setDate(formattedDate);
      } else {
        setDate('');
      }
      setErrorMsg('');
    } else {
      setTitle('');
      setAmount('');
      setCategory('');
      setDate('');
      setErrorMsg('');
    }
  }, [props.editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Please enter a title for the expense.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Amount must be a positive number greater than 0.');
      return;
    }
    if (!category) {
      setErrorMsg('Please pick a category.');
      return;
    }
    if (!date) {
      setErrorMsg('Please select a date.');
      return;
    }

    setErrorMsg('');

    var expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category: category,
      date: date
    };

    props.onSubmit(expenseData).then((success) => {
      if (success && !props.editingExpense) {
        setTitle('');
        setAmount('');
        setCategory('');
        setDate('');
      }
    });
  };

  return (
    <div className="card">
      <h2>{props.editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>

      {errorMsg && (
        <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '0.9rem' }}>
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Groceries, Coffee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Amount (Rs.)</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={props.loading}>
            {props.loading ? 'Saving...' : (props.editingExpense ? 'Update Expense' : 'Add Expense')}
          </button>
          
          {props.editingExpense && (
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
