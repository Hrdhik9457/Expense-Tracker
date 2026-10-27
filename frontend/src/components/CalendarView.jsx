import React, { useState } from 'react';

function CalendarView(props) {
  var now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [chosenDateStr, setChosenDateStr] = useState(now.toISOString().slice(0, 10));
  const [viewingMonthAll, setViewingMonthAll] = useState(false);

  var monthTitles = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var list = props.expenses || [];
  var dateMap = {};

  for (var i = 0; i < list.length; i++) {
    var entry = list[i];
    var dKey = entry.date ? String(entry.date).slice(0, 10) : '';
    if (dKey) {
      if (!dateMap[dKey]) {
        dateMap[dKey] = {
          records: [],
          total: 0
        };
      }
      dateMap[dKey].records.push(entry);
      dateMap[dKey].total += Number(entry.amount) || 0;
    }
  }

  var currentMonthPrefix = year + '-' + ((month + 1 < 10) ? '0' + (month + 1) : String(month + 1));
  var monthTotal = 0;
  var monthCount = 0;
  var monthExpenses = [];

  for (var k = 0; k < list.length; k++) {
    var ymKey = list[k].date ? String(list[k].date).slice(0, 7) : '';
    if (ymKey === currentMonthPrefix) {
      monthTotal += Number(list[k].amount) || 0;
      monthCount += 1;
      monthExpenses.push(list[k]);
    }
  }

  function goPrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function goNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  function goToToday() {
    var today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setChosenDateStr(today.toISOString().slice(0, 10));
    setViewingMonthAll(false);
  }

  function formatDisplayDate(val) {
    if (!val) return '';
    var pieces = String(val).slice(0, 10).split('-');
    if (pieces.length === 3) {
      return pieces[2] + '/' + pieces[1] + '/' + pieces[0];
    }
    return val;
  }

  var firstDaySlot = new Date(year, month, 1).getDay();
  var totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  var emptyCells = [];
  for (var e = 0; e < firstDaySlot; e++) {
    emptyCells.push(e);
  }

  var monthDayNumbers = [];
  for (var d = 1; d <= totalDaysInMonth; d++) {
    monthDayNumbers.push(d);
  }

  var selectedInfo = dateMap[chosenDateStr] || { records: [], total: 0 };
  var activeTableRows = viewingMonthAll ? monthExpenses : selectedInfo.records;
  var activeTotalAmount = viewingMonthAll ? monthTotal : selectedInfo.total;

  return (
    <div>
      <div className="card">
        <div className="calendar-header">
          <div>
            <h2
              onClick={function() { setViewingMonthAll(true); }}
              title="Click to view all expenses for this month"
              style={{
                margin: 0,
                padding: '4px 6px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{monthTitles[month]} {year}</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--primary)', background: '#e8f0fe', padding: '2px 8px', borderRadius: '10px' }}>
                {viewingMonthAll ? 'Showing Full Month' : 'Click to view all'}
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={goToToday} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              Today
            </button>
            <button type="button" className="btn btn-secondary" onClick={goPrevMonth} style={{ padding: '6px 14px' }}>
              &lt; Prev
            </button>
            <button type="button" className="btn btn-secondary" onClick={goNextMonth} style={{ padding: '6px 14px' }}>
              Next &gt;
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekDays.map(function(dayName) {
            return (
              <div key={dayName} className="calendar-day-head">
                {dayName}
              </div>
            );
          })}

          {emptyCells.map(function(itemIndex) {
            return (
              <div key={'empty-' + itemIndex} className="calendar-cell empty" />
            );
          })}

          {monthDayNumbers.map(function(dayNum) {
            var mStr = (month + 1 < 10) ? '0' + (month + 1) : String(month + 1);
            var dStr = (dayNum < 10) ? '0' + dayNum : String(dayNum);
            var cellKey = year + '-' + mStr + '-' + dStr;

            var dayData = dateMap[cellKey];
            var isChosen = (!viewingMonthAll && cellKey === chosenDateStr);
            var hasExpense = Boolean(dayData && dayData.records.length > 0);

            var cellClassName = 'calendar-cell';
            if (isChosen) cellClassName += ' selected';
            if (hasExpense) cellClassName += ' has-expense';

            return (
              <div
                key={cellKey}
                className={cellClassName}
                onClick={function() {
                  setChosenDateStr(cellKey);
                  setViewingMonthAll(false);
                }}
              >
                <span className="calendar-day-num">{dayNum}</span>
                {hasExpense && (
                  <div className="calendar-day-total">
                    Rs. {dayData.total.toFixed(0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          onClick={function() { setViewingMonthAll(true); }}
          style={{
            marginTop: '16px',
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.88rem',
            color: '#666',
            flexWrap: 'wrap',
            gap: '8px',
            cursor: 'pointer'
          }}
          title="Click to view all expenses for this month"
        >
          <span>
            {monthTitles[month]} {year} Overview: <strong>{monthCount} {monthCount === 1 ? 'expense' : 'expenses'}</strong>
          </span>
          <span>
            Total for {monthTitles[month]}: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>Rs. {monthTotal.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2>
            {viewingMonthAll
              ? 'Expenses for ' + monthTitles[month] + ' ' + year
              : 'Expenses for ' + formatDisplayDate(chosenDateStr)
            }
          </h2>
          {activeTableRows.length > 0 && (
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
              Total: Rs. {activeTotalAmount.toFixed(2)}
            </div>
          )}
        </div>

        {activeTableRows.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px' }}>
            <p>
              {viewingMonthAll
                ? 'No expenses recorded in ' + monthTitles[month] + ' ' + year + '.'
                : 'No expenses recorded on ' + formatDisplayDate(chosenDateStr) + '.'
              }
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
                  {viewingMonthAll && <th>Date</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTableRows.map(function(item, idx) {
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
                      {viewingMonthAll && <td>{formatDisplayDate(item.date)}</td>}
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
                            onClick={function() { props.onDelete(item._id); }}
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
    </div>
  );
}

export default CalendarView;
