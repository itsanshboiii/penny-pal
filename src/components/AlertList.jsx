import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import '../styles/AlertList.css';

const AlertList = () => {
  const { alerts, markAlertAsSeen, clearAlerts } = useExpenses();

  // Format the timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter for unseen alerts
  const unseenAlerts = alerts.filter(alert => !alert.seen);

  if (unseenAlerts.length === 0) {
    return null;
  }

  return (
    <div className="alert-container">
      <div className="alert-header">
        <h3>Budget Alerts</h3>
        {alerts.length > 0 && (
          <button 
            onClick={clearAlerts} 
            className="clear-alerts-btn"
            aria-label="Clear all alerts"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="alerts-list">
        {unseenAlerts.map(alert => (
          <div key={alert.id} className={`alert-item alert-${alert.type}`}>
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
              <div className="alert-timestamp">{formatTime(alert.timestamp)}</div>
            </div>
            <button
              className="dismiss-alert-btn"
              onClick={() => markAlertAsSeen(alert.id)}
              aria-label="Dismiss alert"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertList; 