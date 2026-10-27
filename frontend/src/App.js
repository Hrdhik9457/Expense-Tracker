import React, { useState, useEffect } from 'react';
import './index.css';
import Summary from './components/Summary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    loadAllExpenses();
  }, []);

  function loadAllExpenses() {
    setLoading(true);
    axios.get('/api/expenses')
      .then(function(response) {
        var data = response.data.data;
        setExpenses(data);
        setLoading(false);
      })
      .catch(function(err) {
        console.log('error fetching expenses:', err);
        showMessage('error', 'Could not connect to server. Make sure backend is running.');
        setLoading(false);
      });
  }

  function showMessage(type, msg) {
    setAlertType(type);
    setAlertMsg(msg);
    setTimeout(function() {
      setAlertMsg(null);
      setAlertType('');
    }, 3500);
  }

  async function handleSubmit(formData) {
    setFormLoading(true);

    if (editingExpense) {
      try {
        var url = '/api/expenses/' + editingExpense._id;
        var res = await axios.put(url, formData);
        var updatedExpense = res.data.data;

        var newList = [];
        for (var i = 0; i < expenses.length; i++) {
          if (expenses[i]._id === editingExpense._id) {
            newList.push(updatedExpense);
          } else {
            newList.push(expenses[i]);
          }
        }
        setExpenses(newList);
        setEditingExpense(null);
        showMessage('success', 'Expense updated successfully!');
        setFormLoading(false);
        return true;
      } catch(err) {
        console.log('update failed', err);
        var errMsg = 'Failed to update. Try again.';
        if (err.response && err.response.data) {
          errMsg = err.response.data.message;
        }
        showMessage('error', errMsg);
        setFormLoading(false);
        return false;
      }
    } else {
      try {
        var response = await axios.post('/api/expenses', formData);
        var newExpense = response.data.data;
        setExpenses([newExpense, ...expenses]);
        showMessage('success', 'Expense added!');
        setFormLoading(false);
        return true;
      } catch(err) {
        console.log('add failed:', err);
        var msg = 'Something went wrong.';
        if (err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        }
        showMessage('error', msg);
        setFormLoading(false);
        return false;
      }
    }
  }

  function handleDelete(id) {
    axios.delete('/api/expenses/' + id)
      .then(function() {
        var filtered = expenses.filter(function(e) {
          return e._id !== id;
        });
        setExpenses(filtered);
        showMessage('success', 'Expense deleted.');
      })
      .catch(function(err) {
        console.log(err);
        showMessage('error', 'Delete failed.');
      });
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
    window.scrollTo(0, 0);
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Keep track of your daily spending</p>
      </header>

      {alertMsg &&
        <div className={'alert alert-' + alertType}>
          {alertMsg}
        </div>
      }

      <Summary expenses={expenses} />

      <ExpenseForm
        onSubmit={handleSubmit}
        editingExpense={editingExpense}
        onCancelEdit={handleCancelEdit}
        loading={formLoading}
      />

      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}

export default App;
