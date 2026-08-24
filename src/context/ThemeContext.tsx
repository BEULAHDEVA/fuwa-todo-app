import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ dark: false, toggle: () => {} });

/**
 * ThemeProvider — manages light/dark preference.
 * Reads initial value from localStorage (or prefers-color-scheme media query),
 * sets [data-theme] on <html>, and persists every change to localStorage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('fuwa-theme');
      if (stored) return stored === 'dark';
      return true; // Default to dark mode
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('fuwa-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(v => !v) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
