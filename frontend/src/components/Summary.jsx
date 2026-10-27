import React from 'react';

function Summary(props) {
  var list = props.expenses || [];

  var totalAmount = 0;
  var highest = 0;

  for (var i = 0; i < list.length; i++) {
    var val = Number(list[i].amount) || 0;
    totalAmount += val;
    if (val > highest) {
      highest = val;
    }
  }

  var average = 0;
  if (list.length > 0) {
    average = Math.round(totalAmount / list.length);
  }

  return (
    <div className="summary-card">
      <div>
        <div className="label">Total Amount Spent</div>
        <div className="total">Rs. {totalAmount.toFixed(2)}</div>
        <div className="count">
          {list.length} {list.length === 1 ? 'expense' : 'expenses'} recorded
        </div>
      </div>

      <div className="summary-right">
        <div className="summary-stat">
          <div className="stat-value">Rs. {average}</div>
          <div className="stat-label">Avg per expense</div>
        </div>

        <div className="summary-stat">
          <div className="stat-value">Rs. {highest}</div>
          <div className="stat-label">Highest expense</div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
