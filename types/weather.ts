export type WeatherCondition =
  | 'clear'
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'mist'
  | 'windy'
  | 'hail';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: WeatherCondition;
  precipitationProbability: number;
  windSpeed: number;
  humidity: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  uvIndex: number;
  humidity: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  high: number;
  low: number;
  condition: WeatherCondition;
  description: string;
  humidity: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  dewPoint: number;
  cloudCover: number;
}

export interface SunData {
  sunrise: string;
  sunset: string;
  currentPosition: number; // 0-1 representing sun's position in the arc
}

export interface WeatherData {
  location: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  sun: SunData;
  lastUpdated: string;
  alerts?: WeatherAlert[];
}

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  region?: string;
  coordinates: Coordinates;
  timezone: string;
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: string;
  endTime: string;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  country: string;
  region?: string;
  coordinates: Coordinates;
}

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  severeWeatherAlerts: boolean;
}

export interface FavoriteCity extends CityLocation {
  order: number;
  addedAt: string;
}

export type MapOverlay = 'precipitation' | 'temperature' | 'wind' | 'clouds' | 'none';
