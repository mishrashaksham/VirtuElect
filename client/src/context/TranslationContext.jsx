import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const TranslationContext = createContext();

export const useTranslate = () => useContext(TranslationContext);

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [dictionary, setDictionary] = useState({});

  useEffect(() => {
    if (lang === 'en') {
      setDictionary({});
      return;
    }
    axios.get(`${API_BASE_URL}/api/translate/dict?lang=${lang}`)
      .then(res => {
        if (res.data && !res.data.error) setDictionary(res.data);
      })
      .catch(console.error);
  }, [lang]);

  const t = (text) => dictionary[text] || text;

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
};
