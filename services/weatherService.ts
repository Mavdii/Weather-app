import { CityLocation, WeatherData, SearchSuggestion, Coordinates } from '@/types/weather';
import { mockCities, generateWeatherData, searchSuggestions } from '@/constants/mockData';
import { storageService } from './storageService';

class WeatherService {
  // Search for cities
  async searchCities(query: string): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) return [];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const normalizedQuery = query.toLowerCase().trim();
    return searchSuggestions.filter(
      (city) =>
        city.name.toLowerCase().includes(normalizedQuery) ||
        city.country.toLowerCase().includes(normalizedQuery) ||
        (city.region && city.region.toLowerCase().includes(normalizedQuery))
    );
  }

  // Get city by ID
  getCityById(id: string): CityLocation | undefined {
    return mockCities.find((city) => city.id === id);
  }

  // Get weather data for a city
  async getWeatherForCity(cityId: string): Promise<WeatherData> {
    // Check cache first
    const cached = await storageService.getCachedWeather(cityId);
    if (cached) return cached;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const city = this.getCityById(cityId);
    if (!city) {
      throw new Error('City not found');
    }

    const weatherData = generateWeatherData(city);

    // Cache the result
    await storageService.cacheWeather(weatherData);

    return weatherData;
  }

  // Get weather for coordinates (current location)
  async getWeatherForLocation(coordinates: Coordinates): Promise<WeatherData> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find nearest city from mock data
    let nearestCity = mockCities[0];
    let minDistance = Infinity;

    for (const city of mockCities) {
      const distance = this.calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        city.coordinates.latitude,
        city.coordinates.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    // Create a custom location
    const location: CityLocation = {
      id: `custom-${Date.now()}`,
      name: 'Current Location',
      country: nearestCity.country,
      region: nearestCity.region,
      coordinates,
      timezone: nearestCity.timezone,
    };

    const weatherData = generateWeatherData(location);

    // Update with nearest city for more realistic data
    weatherData.location.name = nearestCity.name;
    weatherData.location.country = nearestCity.country;

    return weatherData;
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Get all available cities
  getAllCities(): CityLocation[] {
    return mockCities;
  }
}

export const weatherService = new WeatherService();
