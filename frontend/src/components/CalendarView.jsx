import React, { useState } from 'react';

function CalendarView(props) {
  var now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [chosenDateStr, setChosenDateStr] = useState(now.toISOString().slice(0, 10));

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

  return (
    <div>
      <div className="card">
        <div className="calendar-header">
          <div>
            <h2 style={{ margin: 0, padding: 0, border: 'none' }}>
              {monthTitles[month]} {year}
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
            var isChosen = (cellKey === chosenDateStr);
            var hasExpense = Boolean(dayData && dayData.records.length > 0);

            var cellClassName = 'calendar-cell';
            if (isChosen) cellClassName += ' selected';
            if (hasExpense) cellClassName += ' has-expense';

            return (
              <div
                key={cellKey}
                className={cellClassName}
                onClick={function() { setChosenDateStr(cellKey); }}
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
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h2>
            Expenses for {formatDisplayDate(chosenDateStr)}
          </h2>
          {selectedInfo.records.length > 0 && (
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
              Total: Rs. {selectedInfo.total.toFixed(2)}
            </div>
          )}
        </div>

        {selectedInfo.records.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px' }}>
            <p>No expenses recorded on {formatDisplayDate(chosenDateStr)}.</p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedInfo.records.map(function(item, idx) {
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
