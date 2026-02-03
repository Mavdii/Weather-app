import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteCity, UserSettings, WeatherData, CityLocation } from '@/types/weather';
import { defaultSettings } from '@/constants/weatherThemes';

const KEYS = {
  FAVORITES: '@climapro/favorites',
  SETTINGS: '@climapro/settings',
  RECENT_SEARCHES: '@climapro/recent_searches',
  CACHED_WEATHER: '@climapro/cached_weather',
  LAST_CITY: '@climapro/last_city',
};

class StorageService {
  // Favorites
  async getFavorites(): Promise<FavoriteCity[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async saveFavorites(favorites: FavoriteCity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  async addFavorite(city: CityLocation): Promise<FavoriteCity[]> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.some((f) => f.id === city.id);

      if (exists) return favorites;

      const newFavorite: FavoriteCity = {
        ...city,
        order: favorites.length,
        addedAt: new Date().toISOString(),
      };

      const updatedFavorites = [...favorites, newFavorite];
      await this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return [];
    }
  }

  async removeFavorite(cityId: string): Promise<FavoriteCity[]> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites
        .filter((f) => f.id !== cityId)
        .map((f, index) => ({ ...f, order: index }));
      await this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return [];
    }
  }

  async reorderFavorites(fromIndex: number, toIndex: number): Promise<FavoriteCity[]> {
    try {
      const favorites = await this.getFavorites();
      const [moved] = favorites.splice(fromIndex, 1);
      favorites.splice(toIndex, 0, moved);
      const reordered = favorites.map((f, index) => ({ ...f, order: index }));
      await this.saveFavorites(reordered);
      return reordered;
    } catch (error) {
      console.error('Error reordering favorites:', error);
      return [];
    }
  }

  // Settings
  async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (error) {
      console.error('Error getting settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async updateSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<UserSettings> {
    try {
      const settings = await this.getSettings();
      const updatedSettings = { ...settings, [key]: value };
      await this.saveSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating setting:', error);
      return defaultSettings;
    }
  }

  // Recent searches
  async getRecentSearches(): Promise<CityLocation[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  async addRecentSearch(city: CityLocation): Promise<CityLocation[]> {
    try {
      const searches = await this.getRecentSearches();
      const filtered = searches.filter((s) => s.id !== city.id);
      const updated = [city, ...filtered].slice(0, 10); // Keep last 10
      await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error adding recent search:', error);
      return [];
    }
  }

  async clearRecentSearches(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }

  // Cached weather data
  async getCachedWeather(cityId: string): Promise<WeatherData | null> {
    try {
      const key = `${KEYS.CACHED_WEATHER}/${cityId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const cached = JSON.parse(data);
      const lastUpdated = new Date(cached.lastUpdated);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

      // Return cached data if less than 1 hour old
      if (hoursDiff < 1) {
        return cached;
      }
      return null;
    } catch (error) {
      console.error('Error getting cached weather:', error);
      return null;
    }
  }

  async cacheWeather(weatherData: WeatherData): Promise<void> {
    try {
      const key = `${KEYS.CACHED_WEATHER}/${weatherData.location.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(weatherData));
    } catch (error) {
      console.error('Error caching weather:', error);
    }
  }

  // Last viewed city
  async getLastCity(): Promise<CityLocation | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LAST_CITY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting last city:', error);
      return null;
    }
  }

  async setLastCity(city: CityLocation): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_CITY, JSON.stringify(city));
    } catch (error) {
      console.error('Error setting last city:', error);
    }
  }
}

export const storageService = new StorageService();
