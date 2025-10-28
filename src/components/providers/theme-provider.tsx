"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'budgetwise-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      const storedTheme = item ? (JSON.parse(item) as Theme) : defaultTheme;
      if (storedTheme !== theme) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error(error);
      setTheme(defaultTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(theme));
    } catch (error) {
      console.error(error);
    }
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
