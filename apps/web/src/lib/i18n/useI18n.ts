'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, TranslationKey } from './translations';

export interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isTransitioning: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [language, setLanguageState] = useState<Language>('uz');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pley_lang') as Language;
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        setLanguageState(saved);
        document.documentElement.setAttribute('lang', saved);
      }
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: Language): void => {
    if (lang === language) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguageState(lang);
      try {
        localStorage.setItem('pley_lang', lang);
        document.documentElement.setAttribute('lang', lang);
      } catch {}
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  }, [language]);

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

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isTransitioning }}>
      <div
        className="transition-opacity duration-150"
        style={{ opacity: isTransitioning ? 0.35 : 1 }}
      >
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
