'use client';

import { useState, useEffect, useCallback } from 'react';
import { Language, translations, TranslationKey } from './translations';

export interface UseI18nReturn {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export function useI18n(): UseI18nReturn {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    const saved = localStorage.getItem('pley_lang') as Language;
    if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language): void => {
    setLanguageState(lang);
    localStorage.setItem('pley_lang', lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const langDict = translations[language];
      if (langDict && key in langDict) {
        return langDict[key];
      }
      return translations.en[key] || String(key);
    },
    [language],
  );

  return { language, setLanguage, t };
}

