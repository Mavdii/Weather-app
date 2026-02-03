import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { WeatherData, CityLocation, FavoriteCity, UserSettings, TemperatureUnit, SpeedUnit } from '@/types/weather';
import { weatherService } from '@/services/weatherService';
import { storageService } from '@/services/storageService';
import { locationService } from '@/services/locationService';
import { useTheme } from './ThemeContext';
import { defaultSettings } from '@/constants/weatherThemes';
import { mockCities } from '@/constants/mockData';

interface WeatherContextType {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  favorites: FavoriteCity[];
  recentSearches: CityLocation[];
  settings: UserSettings;
  selectedCity: CityLocation | null;

  // Actions
  fetchWeatherForCity: (cityId: string) => Promise<void>;
  fetchWeatherForLocation: () => Promise<void>;
  addToFavorites: (city: CityLocation) => Promise<void>;
  removeFromFavorites: (cityId: string) => Promise<void>;
  reorderFavorites: (fromIndex: number, toIndex: number) => Promise<void>;
  addRecentSearch: (city: CityLocation) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  setSelectedCity: (city: CityLocation | null) => void;
  isFavorite: (cityId: string) => boolean;

  // Unit conversions
  formatTemperature: (celsius: number) => string;
  formatSpeed: (kmh: number) => string;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const { setWeatherCondition } = useTheme();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [recentSearches, setRecentSearches] = useState<CityLocation[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [loadedFavorites, loadedSearches, loadedSettings, lastCity] = await Promise.all([
          storageService.getFavorites(),
          storageService.getRecentSearches(),
          storageService.getSettings(),
          storageService.getLastCity(),
        ]);

        setFavorites(loadedFavorites);
        setRecentSearches(loadedSearches);
        setSettings(loadedSettings);

        // Load weather for last city or default
        const cityToLoad = lastCity || mockCities[0];
        if (cityToLoad) {
          setSelectedCity(cityToLoad);
          fetchWeatherForCity(cityToLoad.id);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Update theme when weather changes
  useEffect(() => {
    if (weatherData?.current.condition) {
      setWeatherCondition(weatherData.current.condition);
    }
  }, [weatherData?.current.condition, setWeatherCondition]);

  const fetchWeatherForCity = useCallback(async (cityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const city = weatherService.getCityById(cityId);
      if (city) {
        setSelectedCity(city);
        await storageService.setLastCity(city);
      }

      const data = await weatherService.getWeatherForCity(cityId);
      setWeatherData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWeatherForLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await locationService.getCurrentLocation();

      if (!coordinates) {
        setError('Location permission denied or unavailable');
        return;
      }

      const data = await weatherService.getWeatherForLocation(coordinates);
      setWeatherData(data);
      setSelectedCity(data.location);
      await storageService.setLastCity(data.location);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather for current location';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToFavorites = useCallback(async (city: CityLocation) => {
    const updated = await storageService.addFavorite(city);
    setFavorites(updated);
  }, []);

  const removeFromFavorites = useCallback(async (cityId: string) => {
    const updated = await storageService.removeFavorite(cityId);
    setFavorites(updated);
  }, []);

  const reorderFavorites = useCallback(async (fromIndex: number, toIndex: number) => {
    const updated = await storageService.reorderFavorites(fromIndex, toIndex);
    setFavorites(updated);
  }, []);

  const addRecentSearch = useCallback(async (city: CityLocation) => {
    const updated = await storageService.addRecentSearch(city);
    setRecentSearches(updated);
  }, []);

  const clearRecentSearches = useCallback(async () => {
    await storageService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    await storageService.saveSettings(updated);
    setSettings(updated);
  }, [settings]);

  const isFavorite = useCallback((cityId: string) => {
    return favorites.some((f) => f.id === cityId);
  }, [favorites]);

  // Unit conversion functions
  const formatTemperature = useCallback((celsius: number): string => {
    if (settings.temperatureUnit === 'fahrenheit') {
      const fahrenheit = (celsius * 9) / 5 + 32;
      return `${Math.round(fahrenheit)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  }, [settings.temperatureUnit]);

  const formatSpeed = useCallback((kmh: number): string => {
    if (settings.speedUnit === 'mph') {
      const mph = kmh * 0.621371;
      return `${Math.round(mph)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  }, [settings.speedUnit]);

  const value = useMemo(
    () => ({
      weatherData,
      isLoading,
      error,
      favorites,
      recentSearches,
      settings,
      selectedCity,
      fetchWeatherForCity,
      fetchWeatherForLocation,
      addToFavorites,
      removeFromFavorites,
      reorderFavorites,
      addRecentSearch,
      clearRecentSearches,
      updateSettings,
      setSelectedCity,
      isFavorite,
      formatTemperature,
      formatSpeed,
    }),
    [
      weatherData,
      isLoading,
      error,
      favorites,
      recentSearches,
      settings,
      selectedCity,
      fetchWeatherForCity,
      fetchWeatherForLocation,
      addToFavorites,
      removeFromFavorites,
      reorderFavorites,
      addRecentSearch,
      clearRecentSearches,
      updateSettings,
      isFavorite,
      formatTemperature,
      formatSpeed,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
