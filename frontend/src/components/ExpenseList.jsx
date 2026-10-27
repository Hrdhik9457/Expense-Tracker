import React, { useState } from 'react';

function ExpenseList(props) {
  const [chosenCategory, setChosenCategory] = useState('All');
  const [queryText, setQueryText] = useState('');
  const [pickedDate, setPickedDate] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');

  var rawList = props.expenses || [];
  var resultList = [];
  var runningTotal = 0;

  for (var i = 0; i < rawList.length; i++) {
    var cur = rawList[i];

    if (chosenCategory !== 'All' && cur.category !== chosenCategory) {
      continue;
    }

    if (queryText.trim() !== '') {
      var heading = cur.title ? cur.title.toLowerCase() : '';
      if (heading.indexOf(queryText.toLowerCase()) === -1) {
        continue;
      }
    }

    if (pickedDate !== '') {
      var isoDate = cur.date ? String(cur.date).slice(0, 10) : '';
      if (isoDate !== pickedDate) {
        continue;
      }
    }

    resultList.push(cur);
    runningTotal += Number(cur.amount) || 0;
  }

  function displayDate(val) {
    if (!val) return '';
    var s = String(val).slice(0, 10);
    var chunks = s.split('-');
    if (chunks.length === 3) {
      return chunks[2] + '/' + chunks[1] + '/' + chunks[0];
    }
    return s;
  }

  function pickToday() {
    var now = new Date();
    var iso = now.toISOString().slice(0, 10);
    setPickedDate(iso);
  }

  function clearAllFilters() {
    setChosenCategory('All');
    setQueryText('');
    setPickedDate('');
  }

  function askDelete(expense) {
    setDeletingId(expense._id);
    setDeletingName(expense.title);
  }

  function runDelete() {
    if (deletingId) {
      props.onDelete(deletingId);
      setDeletingId(null);
      setDeletingName('');
    }
  }

  var isFiltered = chosenCategory !== 'All' || queryText.length > 0 || pickedDate.length > 0;

  return (
    <div>
      <div className="card">
        <h2>Expense History</h2>

        <div className="filter-bar">
          <label>Filter:</label>
          <select
            value={chosenCategory}
            onChange={function(e) { setChosenCategory(e.target.value); }}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Search by title..."
            value={queryText}
            onChange={function(e) { setQueryText(e.target.value); }}
            style={{ flex: 1, minWidth: '130px' }}
          />

          <input
            type="date"
            value={pickedDate}
            onChange={function(e) { setPickedDate(e.target.value); }}
          />

          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={pickToday}
          >
            Today
          </button>

          {isFiltered && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={clearAllFilters}
            >
              Reset
            </button>
          )}
        </div>

        {props.loading ? (
          <div className="loading">Loading expenses...</div>
        ) : resultList.length === 0 ? (
          <div className="empty-state">
            <p>
              {rawList.length === 0
                ? 'No expenses recorded yet. Add one above!'
                : 'No expenses found matching current filter.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resultList.map(function(item, idx) {
                    var amt = Number(item.amount) || 0;
                    return (
                      <tr key={item._id || idx}>
                        <td>{idx + 1}</td>
                        <td><strong>{item.title}</strong></td>
                        <td>
                          <span className="amount">
                            Rs. {amt.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className={'badge badge-' + item.category}>
                            {item.category}
                          </span>
                        </td>
                        <td>{displayDate(item.date)}</td>
                        <td>
                          <div className="actions-cell">
                            <button
                              type="button"
                              className="btn btn-edit"
                              onClick={function() { props.onEdit(item); }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-delete"
                              onClick={function() { askDelete(item); }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #dee2e6', paddingTop: '10px' }}>
              <span>Showing {resultList.length} {resultList.length === 1 ? 'expense' : 'expenses'}</span>
              <span>
                {pickedDate ? 'Total for ' + displayDate(pickedDate) + ': ' : 'Filtered Total: '}
                <strong style={{ color: '#222', fontSize: '0.95rem' }}>Rs. {runningTotal.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {deletingId && (
        <div className="modal-overlay" onClick={function() { setDeletingId(null); }}>
          <div className="modal" onClick={function(e) { e.stopPropagation(); }}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the expense for <strong>"{deletingName}"</strong>?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={function() { setDeletingId(null); }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={runDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
