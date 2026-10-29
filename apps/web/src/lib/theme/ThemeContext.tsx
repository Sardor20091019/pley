'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, canStorePreferences } from '../cookies';

export type AppTheme = 'cartoon' | 'editorial';

export interface ThemeContextValue {
  theme: AppTheme;
  isTransitioning: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [theme, setThemeState] = useState<AppTheme>('cartoon');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (!canStorePreferences()) {
        setThemeState('cartoon');
        document.documentElement.setAttribute('data-theme', 'cartoon');
        return;
      }

      const saved = (getCookie('pley_theme_mode') || localStorage.getItem('pley_theme_mode')) as AppTheme;
      if (saved === 'cartoon' || saved === 'editorial') {
        setThemeState(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        setThemeState('cartoon');
        document.documentElement.setAttribute('data-theme', 'cartoon');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'cartoon');
    }
  }, []);

  const setTheme = useCallback((next: AppTheme): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setThemeState(next);
      document.documentElement.setAttribute('data-theme', next);
      if (canStorePreferences()) {
        try {
          setCookie('pley_theme_mode', next, 365);
          localStorage.setItem('pley_theme_mode', next);
        } catch {}
      }
      setTimeout(() => setIsTransitioning(false), 400);
    }, 200);
  }, [isTransitioning]);

  const toggleTheme = useCallback((): void => {
    setTheme(theme === 'cartoon' ? 'editorial' : 'cartoon');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, isTransitioning, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return ctx;
}
