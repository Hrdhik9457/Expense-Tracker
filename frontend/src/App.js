import React from 'react';
import axios from 'axios';
import './index.css';

import Summary from './components/Summary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CalendarView from './components/CalendarView';

var apiBase = process.env.REACT_APP_API_URL || '';

export default function App() {
  const [expenses, setExpenses] = React.useState([]);
  const [activeEditItem, setActiveEditItem] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notice, setNotice] = React.useState(null);
  const [currentTab, setCurrentTab] = React.useState('expenses');

  React.useEffect(function() {
    setIsFetching(true);
    axios.get(apiBase + '/api/expenses')
      .then(function(resp) {
        setExpenses(resp.data.data || []);
        setIsFetching(false);
      })
      .catch(function() {
        flashNotice('Could not load data from database server.', true);
        setIsFetching(false);
      });
  }, []);

  function flashNotice(text, isDanger) {
    setNotice({ text: text, isDanger: isDanger });
    window.setTimeout(function() {
      setNotice(null);
    }, 3800);
  }

  async function handleRecordSubmit(payload) {
    setIsSaving(true);

    if (activeEditItem) {
      try {
        var putTarget = apiBase + '/api/expenses/' + activeEditItem._id;
        var putResult = await axios.put(putTarget, payload);
        var freshRow = putResult.data.data;

        var nextRows = [];
        for (var idx = 0; idx < expenses.length; idx++) {
          var cur = expenses[idx];
          if (cur._id === activeEditItem._id) {
            nextRows.push(freshRow);
          } else {
            nextRows.push(cur);
          }
        }

        setExpenses(nextRows);
        setActiveEditItem(null);
        flashNotice('Expense updated successfully.', false);
        setIsSaving(false);
        return true;
      } catch (e) {
        var errorDetail = (e.response && e.response.data && e.response.data.message) || 'Update operation rejected.';
        flashNotice(errorDetail, true);
        setIsSaving(false);
        return false;
      }
    } else {
      try {
        var postResult = await axios.post(apiBase + '/api/expenses', payload);
        var createdRow = postResult.data.data;
        setExpenses([createdRow, ...expenses]);
        flashNotice('New expense logged.', false);
        setIsSaving(false);
        return true;
      } catch (e) {
        var reason = (e.response && e.response.data && e.response.data.message) || 'Saving expense failed.';
        flashNotice(reason, true);
        setIsSaving(false);
        return false;
      }
    }
  }

  function removeExpense(targetId) {
    axios.delete(apiBase + '/api/expenses/' + targetId)
      .then(function() {
        var remainder = expenses.filter(function(row) {
          return row._id !== targetId;
        });
        setExpenses(remainder);
        flashNotice('Expense deleted.', false);
      })
      .catch(function() {
        flashNotice('Unable to remove expense entry.', true);
      });
  }

  function triggerEdit(row) {
    setActiveEditItem(row);
    setCurrentTab('expenses');
    window.scrollTo(0, 0);
  }

  function dismissEdit() {
    setActiveEditItem(null);
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Keep track of your daily spending</p>
      </header>

      {notice && (
        <div className={'alert ' + (notice.isDanger ? 'alert-error' : 'alert-success')}>
          {notice.text}
        </div>
      )}

      <Summary expenses={expenses} />

      <div className="tab-navigation">
        <button
          type="button"
          className={currentTab === 'expenses' ? 'tab-btn active' : 'tab-btn'}
          onClick={function() { setCurrentTab('expenses'); }}
        >
          Expenses & Form
        </button>
        <button
          type="button"
          className={currentTab === 'calendar' ? 'tab-btn active' : 'tab-btn'}
          onClick={function() { setCurrentTab('calendar'); }}
        >
          Calendar View
        </button>
      </div>

      {currentTab === 'expenses' ? (
        <div>
          <ExpenseForm
            onSubmit={handleRecordSubmit}
            editingExpense={activeEditItem}
            onCancelEdit={dismissEdit}
            loading={isSaving}
          />

          <ExpenseList
            expenses={expenses}
            onEdit={triggerEdit}
            onDelete={removeExpense}
            loading={isFetching}
          />
        </div>
      ) : (
        <CalendarView
          expenses={expenses}
          onEdit={triggerEdit}
          onDelete={removeExpense}
        />
      )}
    </div>
  );
}
