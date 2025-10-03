import React from 'react';

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  // You can also show a user-friendly error message here
});

// Global error handler for JavaScript errors
window.addEventListener('error', event => {
  console.error('Global JavaScript error:', event.error);
});

export const DebugInfo = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>Auth Token: {localStorage.getItem('access_token') ? '✅' : '❌'}</div>
      <div>User Data: {localStorage.getItem('user') ? '✅' : '❌'}</div>
      <div>URL: {window.location.pathname}</div>
      <div>Time: {new Date().toLocaleTimeString()}</div>
    </div>
  );
};