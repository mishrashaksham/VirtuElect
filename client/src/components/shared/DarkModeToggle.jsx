import React from 'react';
import useAppStore from '../../store/appStore';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <button 
      onClick={toggleDarkMode}
      className="w-10 h-10 neu-raised bg-gray-200 dark:bg-[#151515] rounded-full flex items-center justify-center text-[var(--color-primary)] hover:bg-gray-300 dark:hover:bg-[#1a1a1a] transition-colors"
      title="Toggle Theme"
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
        {darkMode ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
};

export default DarkModeToggle;
