import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isBlack: boolean;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  isBlack: false,
  isDark: false,
  isLight: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('mentra_theme') as ThemeMode;
      if (saved === 'black' || saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('mentra_theme', newTheme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-black', 'dark');

    if (theme === 'black') {
      root.classList.add('theme-black', 'dark');
      root.style.backgroundColor = '#000000';
      root.style.colorScheme = 'dark';
    } else if (theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
      root.style.backgroundColor = '#0F172A';
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('theme-light');
      root.style.backgroundColor = '#F8FAFC';
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const isBlack = theme === 'black';
  const isDark = theme === 'dark' || theme === 'black';
  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isBlack, isDark, isLight }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
