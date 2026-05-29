// ============================================================
// src/theme/ThemeContext.tsx
// ============================================================
import React, { createContext, useContext, useState } from 'react';
import { DARK, LIGHT, Theme } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeCtx {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: DARK, isDark: true, toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  const toggle = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme: isDark ? DARK : LIGHT, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
