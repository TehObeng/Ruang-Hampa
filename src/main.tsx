// ===================================
// MAIN ENTRY POINT
// Application bootstrap
// ===================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('='.repeat(60));
console.log('🎮 RUANG HAMPA - Depression Simulation Game');
console.log('='.repeat(60));
console.log('[Main] Starting application...');
console.log(`[Main] Environment: ${import.meta.env.MODE}`);
console.log(`[Main] Base URL: ${import.meta.env.BASE_URL}`);
console.log(`[Main] Timestamp: ${new Date().toISOString()}`);
console.log('='.repeat(60));

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[Main] ✗ Root element not found! Cannot mount application.');
  throw new Error('Root element #root not found in DOM');
}

// Mount React application
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('[Main] ✓ React application mounted successfully');
} catch (error) {
  console.error('[Main] ✗ Failed to mount React application:', error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: monospace; color: #e57373;">
      <h1>⚠️ Application Error</h1>
      <p>Failed to load the game. Please refresh the page.</p>
      <p style="font-size: 0.9rem; color: #999;">Check console for details.</p>
    </div>
  `;
}
