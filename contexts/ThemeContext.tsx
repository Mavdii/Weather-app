import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { WeatherCondition, ThemeMode } from '@/types/weather';
import { weatherThemesByCondition, WeatherTheme } from '@/constants/weatherThemes';
import { storageService } from '@/services/storageService';

interface ThemeContextType {
  theme: WeatherTheme;
  themeMode: ThemeMode;
  isDark: boolean;
  weatherCondition: WeatherCondition;
  setThemeMode: (mode: ThemeMode) => void;
  setWeatherCondition: (condition: WeatherCondition) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('clear');

  // Determine if dark mode should be active
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Get the current theme based on weather condition and dark/light mode
  const theme = useMemo(() => {
    const themes = weatherThemesByCondition[weatherCondition];
    return isDark ? themes.dark : themes.light;
  }, [weatherCondition, isDark]);

  // Load saved theme mode on mount
  useEffect(() => {
    const loadThemeMode = async () => {
      const settings = await storageService.getSettings();
      setThemeModeState(settings.themeMode);
    };
    loadThemeMode();
  }, []);

  // Save theme mode when changed
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await storageService.updateSetting('themeMode', mode);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      weatherCondition,
      setThemeMode,
      setWeatherCondition,
    }),
    [theme, themeMode, isDark, weatherCondition, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
