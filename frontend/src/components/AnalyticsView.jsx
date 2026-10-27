import React, { useState } from 'react';

function AnalyticsView(props) {
  const [rangeMode, setRangeMode] = useState('month');

  var list = props.expenses || [];
  var monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  var buckets = {};
  var totalExpenseSum = 0;

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var amt = Number(item.amount) || 0;
    totalExpenseSum += amt;

    if (!item.date) continue;
    var dObj = new Date(item.date);
    if (isNaN(dObj.getTime())) continue;

    var groupKey = '';
    var groupLabel = '';

    if (rangeMode === 'year') {
      groupKey = String(dObj.getFullYear());
      groupLabel = groupKey;
    } else if (rangeMode === 'month') {
      var y = dObj.getFullYear();
      var m = dObj.getMonth();
      var mNum = m + 1 < 10 ? '0' + (m + 1) : String(m + 1);
      groupKey = y + '-' + mNum;
      groupLabel = monthNames[m] + ' ' + y;
    } else {
      var dayOfWeek = dObj.getDay();
      var start = new Date(dObj);
      start.setDate(dObj.getDate() - dayOfWeek);
      var sy = start.getFullYear();
      var sm = start.getMonth() + 1;
      var sd = start.getDate();
      var smStr = sm < 10 ? '0' + sm : String(sm);
      var sdStr = sd < 10 ? '0' + sd : String(sd);
      groupKey = sy + '-' + smStr + '-' + sdStr;
      groupLabel = 'Wk ' + sdStr + '/' + smStr;
    }

    if (!buckets[groupKey]) {
      buckets[groupKey] = {
        key: groupKey,
        label: groupLabel,
        total: 0,
        count: 0
      };
    }

    buckets[groupKey].total += amt;
    buckets[groupKey].count += 1;
  }

  var sortedKeys = Object.keys(buckets).sort();
  var chartData = [];
  var peakAmount = 0;

  for (var k = 0; k < sortedKeys.length; k++) {
    var b = buckets[sortedKeys[k]];
    chartData.push(b);
    if (b.total > peakAmount) {
      peakAmount = b.total;
    }
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, padding: 0, border: 'none' }}>Spending Analytics</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Compare your expenses over time
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-gray)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <button
              type="button"
              className={'btn ' + (rangeMode === 'week' ? 'btn-primary' : 'btn-secondary')}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={function() { setRangeMode('week'); }}
            >
              Week by Week
            </button>
            <button
              type="button"
              className={'btn ' + (rangeMode === 'month' ? 'btn-primary' : 'btn-secondary')}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={function() { setRangeMode('month'); }}
            >
              Month by Month
            </button>
            <button
              type="button"
              className={'btn ' + (rangeMode === 'year' ? 'btn-primary' : 'btn-secondary')}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={function() { setRangeMode('year'); }}
            >
              Year by Year
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="empty-state" style={{ padding: '36px' }}>
            <p>No expense data available to plot charts.</p>
          </div>
        ) : (
          <div>
            <div className="chart-container">
              {chartData.map(function(item) {
                var barHeightPercent = peakAmount > 0 ? Math.max(12, Math.round((item.total / peakAmount) * 100)) : 0;
                return (
                  <div key={item.key} className="chart-col">
                    <div className="chart-amount">
                      Rs. {item.total.toFixed(0)}
                    </div>
                    <div className="chart-bar-wrap">
                      <div
                        className="chart-bar"
                        style={{ height: barHeightPercent + '%' }}
                        title={item.label + ': Rs. ' + item.total.toFixed(2) + ' (' + item.count + ' expenses)'}
                      />
                    </div>
                    <div className="chart-label">{item.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                      {item.count} {item.count === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px' }}>
                Summary Breakdown ({rangeMode === 'week' ? 'Weekly' : (rangeMode === 'month' ? 'Monthly' : 'Yearly')})
              </h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Total Spent</th>
                      <th>Number of Expenses</th>
                      <th>Share of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map(function(row) {
                      var share = totalExpenseSum > 0 ? ((row.total / totalExpenseSum) * 100).toFixed(1) : '0';
                      return (
                        <tr key={row.key}>
                          <td><strong>{row.label}</strong></td>
                          <td>
                            <span className="amount">Rs. {row.total.toFixed(2)}</span>
                          </td>
                          <td>{row.count}</td>
                          <td>
                            <span className="badge badge-Travel" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                              {share}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsView;
