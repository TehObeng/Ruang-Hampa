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
// Fix: Cast import.meta to any to access Vite env variables without TS errors.
console.log(`[Main] Environment: ${(import.meta as any).env.MODE}`);
// Fix: Cast import.meta to any to access Vite env variables without TS errors.
console.log(`[Main] Base URL: ${(import.meta as any).env.BASE_URL}`);
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