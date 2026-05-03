import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TranslationProvider } from './context/TranslationContext';
import ErrorBoundary from './components/ErrorBoundary';

import { HashRouter } from 'react-router-dom';

// Google Analytics initialization snippet (Placeholder)
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-PLACEHOLDER-ID');
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider>
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    </TranslationProvider>
  </React.StrictMode>,
);
