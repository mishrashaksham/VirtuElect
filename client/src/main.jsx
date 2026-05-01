import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TranslationProvider } from './context/TranslationContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider>
      <App />
    </TranslationProvider>
  </React.StrictMode>,
);
