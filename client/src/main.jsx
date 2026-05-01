import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TranslationProvider } from './context/TranslationContext';

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
        <App />
      </HashRouter>
    </TranslationProvider>
  </React.StrictMode>,
);
