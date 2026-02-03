import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Suppress console warnings in development
if (import.meta.env.MODE === 'development') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress React Router future flag warnings
      if (message.includes('React Router Future Flag Warning')) {
        return;
      }
      // Suppress key prop warnings
      if (message.includes('Each child in a list should have a unique "key" prop')) {
        return;
      }
      // Suppress MUI Grid warnings
      if (message.includes('MUI Grid:')) {
        return;
      }
      // Suppress any other common React warnings
      if (message.includes('Warning:')) {
        return;
      }
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(<App />);
