import React, { useState } from 'react';
import axios from 'axios';
import useAppStore from '../../store/appStore';
import { useTranslate } from '../../context/TranslationContext';

const GyaniBubble = () => {
  const { t } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const { gyaniState, setGyaniState, setConstituencyData, setCurrentView } = useAppStore();
  const [localError, setLocalError] = useState('');

  const handleManualSelection = () => {
    setIsOpen(false);
    setCurrentView('select');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4 max-w-sm">
      {isOpen && (
        <div 
          className="glass-panel p-5 relative shadow-2xl mb-2"
          style={{ borderRadius: '24px 24px 0 24px' }}
        >
          <div className="text-[var(--text-primary)] font-medium leading-relaxed">
            {gyaniState === 'greeting' && (
              <>
                <p className="mb-4">{t("Namaste! I am Gyani. Ready to understand your role in the world's largest democracy?")}</p>
                <div className="flex gap-2">
                  <button onClick={() => setGyaniState('location_ask')} className="btn-primary py-2 text-sm">
                    {t("Let's Start")}
                  </button>
                  <button onClick={handleManualSelection} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] interactive">
                    {t("I'll select manually")}
                  </button>
                </div>
              </>
            )}

            {gyaniState === 'location_ask' && (
              <>
                <p className="mb-4">{t("Great! Click below to select your state and constituency.")}</p>
                <button onClick={handleManualSelection} className="btn-primary py-2 text-sm w-full">
                  {t("Select Constituency")}
                </button>
              </>
            )}
          </div>
          
          {/* Chat Bubble Tail */}
          <div className="absolute -bottom-3 right-4 w-6 h-6 bg-[var(--glass-bg)] border-r border-b border-[var(--glass-border)] transform rotate-45 z-[-1]" style={{ backdropFilter: 'blur(16px)' }}></div>
        </div>
      )}

      {/* Static Sticky Avatar Button */}
      <button 
        className="relative w-16 h-16 shrink-0 drop-shadow-xl interactive rounded-full bg-[var(--primary-blue)] border-4 border-white dark:border-[var(--surface-color)] hover:scale-105 transition-transform" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Gyani AI"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
          <circle cx="50" cy="50" r="48" fill="var(--primary-blue)" />
          {/* Saffron Turban/Cap */}
          <path d="M 20 40 Q 50 10 80 40 Q 50 20 20 40" fill="var(--accent-saffron)" />
          {/* Face */}
          <circle cx="50" cy="60" r="25" fill="#FFE0BD" />
          {/* Eyes */}
          <circle cx="40" cy="55" r="3" fill="#333" />
          <circle cx="60" cy="55" r="3" fill="#333" />
          {/* Smile */}
          <path d="M 40 70 Q 50 80 60 70" stroke="#333" strokeWidth="2" fill="none" />
          {/* Glasses */}
          <circle cx="40" cy="55" r="7" stroke="#333" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="55" r="7" stroke="#333" strokeWidth="1.5" fill="none" />
          <line x1="47" y1="55" x2="53" y2="55" stroke="#333" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
};

export default GyaniBubble;
