import React, { useState } from 'react';

function ExpenseList(props) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  var allItems = props.expenses || [];

  var displayedExpenses = allItems.filter(function(item) {
    var matchCategory = true;
    if (selectedCategory !== 'All') {
      matchCategory = (item.category === selectedCategory);
    }

    var matchSearch = true;
    if (searchTerm.trim() !== '') {
      matchSearch = item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    }

    return matchCategory && matchSearch;
  });

  function formatExpenseDate(str) {
    if (!str) return '';
    var dateObj = new Date(str);
    var day = dateObj.getDate();
    var month = dateObj.getMonth() + 1;
    var year = dateObj.getFullYear();
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    return day + '/' + month + '/' + year;
  }

  function confirmDelete() {
    if (itemToDelete) {
      props.onDelete(itemToDelete._id);
      setItemToDelete(null);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Expense History</h2>

        <div className="filter-bar">
          <label>Filter:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '150px' }}
          />

          {(selectedCategory !== 'All' || searchTerm) && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              Reset
            </button>
          )}
        </div>

        {props.loading ? (
          <div className="loading">Loading expenses...</div>
        ) : displayedExpenses.length === 0 ? (
          <div className="empty-state">
            <p>
              {allItems.length === 0
                ? 'No expenses recorded yet. Add one above!'
                : 'No expenses found matching current filter.'}
            </p>
          </div>
        ) : (
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
                {displayedExpenses.map(function(item, idx) {
                  return (
                    <tr key={item._id || idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{item.title}</strong></td>
                      <td>
                        <span className="amount">
                          Rs. {Number(item.amount).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className={'badge badge-' + item.category}>
                          {item.category}
                        </span>
                      </td>
                      <td>{formatExpenseDate(item.date)}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            type="button"
                            className="btn btn-edit"
                            onClick={() => props.onEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-delete"
                            onClick={() => setItemToDelete(item)}
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
        )}
      </div>

      {itemToDelete && (
        <div className="modal-overlay" onClick={() => setItemToDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the expense for{' '}
              <strong>"{itemToDelete.title}"</strong> of Rs.{' '}
              {itemToDelete.amount}?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
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
