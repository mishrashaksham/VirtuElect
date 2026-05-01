import React from 'react';
import { useTranslate } from '../../context/TranslationContext';
import LanguageSwitcher from './LanguageSwitcher';
import useAppStore from '../../store/appStore';

const Header = () => {
  const { t } = useTranslate();

  return (
    <header className="bg-gray-100/60 dark:bg-[#0A0A0A]/60 backdrop-blur-xl flex justify-between items-center h-16 px-8 mx-auto w-full sticky top-0 z-50 border-b border-black/5 dark:border-white/5 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-gray-100 uppercase font-display-xl">
          {t('VirtuElect')}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => useAppStore.getState().setCurrentView('select')}
          className="neu-raised bg-[var(--color-primary-container)] text-white dark:text-[var(--color-on-primary-container)] px-6 py-2 rounded-full font-label-caps text-[var(--font-label-caps)] hover:translate-y-[-1px] transition-transform flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
        >
          {t('Know Your Candidate')}
        </button>
        <div className="flex gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
