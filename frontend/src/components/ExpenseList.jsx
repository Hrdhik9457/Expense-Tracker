import React, { useState } from 'react';

function ExpenseList(props) {
  const [chosenCategory, setChosenCategory] = useState('All');
  const [queryText, setQueryText] = useState('');
  const [pickedDate, setPickedDate] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [perPageCount, setPerPageCount] = useState(10);

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

  var totalPages = Math.ceil(resultList.length / perPageCount) || 1;
  var currentPage = activePage;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  var startPos = (currentPage - 1) * perPageCount;
  var visibleRows = resultList.slice(startPos, startPos + perPageCount);

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
    setActivePage(1);
  }

  function clearAllFilters() {
    setChosenCategory('All');
    setQueryText('');
    setPickedDate('');
    setActivePage(1);
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
            onChange={function(e) {
              setChosenCategory(e.target.value);
              setActivePage(1);
            }}
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
            onChange={function(e) {
              setQueryText(e.target.value);
              setActivePage(1);
            }}
            style={{ flex: 1, minWidth: '130px' }}
          />

          <input
            type="date"
            value={pickedDate}
            onChange={function(e) {
              setPickedDate(e.target.value);
              setActivePage(1);
            }}
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
                  {visibleRows.map(function(item, idx) {
                    var amt = Number(item.amount) || 0;
                    return (
                      <tr key={item._id || idx}>
                        <td>{startPos + idx + 1}</td>
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

            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #dee2e6', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                Showing {resultList.length === 0 ? 0 : startPos + 1} to {Math.min(startPos + perPageCount, resultList.length)} of {resultList.length} expenses
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem' }}>Rows per page:</span>
                <select
                  value={perPageCount}
                  onChange={function(e) {
                    setPerPageCount(Number(e.target.value));
                    setActivePage(1);
                  }}
                  style={{ padding: '4px 8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  disabled={currentPage <= 1}
                  onClick={function() { setActivePage(currentPage - 1); }}
                >
                  &lt; Prev
                </button>

                <span style={{ fontWeight: 600, color: '#333', fontSize: '0.82rem' }}>
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  disabled={currentPage >= totalPages}
                  onClick={function() { setActivePage(currentPage + 1); }}
                >
                  Next &gt;
                </button>
              </div>

              <div>
                {pickedDate ? 'Total for ' + displayDate(pickedDate) + ': ' : 'Filtered Total: '}
                <strong style={{ color: '#222', fontSize: '0.95rem' }}>Rs. {runningTotal.toFixed(2)}</strong>
              </div>
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
