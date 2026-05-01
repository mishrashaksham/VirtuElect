import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TranslationProvider } from './context/TranslationContext';

import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </TranslationProvider>
  </React.StrictMode>,
);
