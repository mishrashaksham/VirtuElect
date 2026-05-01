import React from 'react';
import { useTranslate } from '../../context/TranslationContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'kn', label: 'കന്നഡ' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'as', label: 'অসমীয়া' }
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useTranslate();

  return (
    <div className="relative group z-50">
      <button className="w-10 h-10 neu-raised bg-gray-200 dark:bg-[#151515] rounded-full flex items-center justify-center text-[var(--color-primary)] hover:bg-gray-300 dark:hover:bg-[#1a1a1a] transition-colors overflow-hidden relative">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
        <select 
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          title="Select Language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="text-black dark:text-white bg-white dark:bg-black">
              {l.label}
            </option>
          ))}
        </select>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
