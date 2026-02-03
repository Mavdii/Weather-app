import { WeatherData, CityLocation, SearchSuggestion } from '@/types/weather';

export const mockCities: CityLocation[] = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'New York',
    coordinates: { latitude: 40.7128, longitude: -74.006 },
    timezone: 'America/New_York',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'England',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    timezone: 'Europe/London',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Tokyo',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Ile-de-France',
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    timezone: 'Europe/Paris',
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'New South Wales',
    coordinates: { latitude: -33.8688, longitude: 151.2093 },
    timezone: 'Australia/Sydney',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Dubai',
    coordinates: { latitude: 25.2048, longitude: 55.2708 },
    timezone: 'Asia/Dubai',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: '',
    coordinates: { latitude: 1.3521, longitude: 103.8198 },
    timezone: 'Asia/Singapore',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'United States',
    region: 'California',
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    timezone: 'America/Los_Angeles',
  },
];

export const searchSuggestions: SearchSuggestion[] = mockCities.map((city) => ({
  id: city.id,
  name: city.name,
  country: city.country,
  region: city.region,
  coordinates: city.coordinates,
}));

const generateHourlyForecast = (baseTemp: number) => {
  const hours = [];
  const now = new Date();
  const conditions = ['clear', 'sunny', 'partly-cloudy', 'cloudy'] as const;

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hourOfDay = time.getHours();

    // Temperature varies based on time of day
    let tempVariation = 0;
    if (hourOfDay >= 6 && hourOfDay <= 14) {
      tempVariation = (hourOfDay - 6) * 0.8;
    } else if (hourOfDay > 14 && hourOfDay <= 20) {
      tempVariation = (20 - hourOfDay) * 0.6;
    } else {
      tempVariation = -3;
    }

    hours.push({
      time: time.toISOString(),
      temperature: Math.round(baseTemp + tempVariation + (Math.random() * 2 - 1)),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitationProbability: Math.floor(Math.random() * 30),
      windSpeed: Math.floor(10 + Math.random() * 15),
      humidity: Math.floor(40 + Math.random() * 30),
    });
  }
  return hours;
};

const generateDailyForecast = (baseTemp: number) => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const conditions = ['clear', 'sunny', 'partly-cloudy', 'cloudy', 'rain'] as const;

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const high = Math.round(baseTemp + 3 + Math.random() * 4);
    const low = Math.round(baseTemp - 5 - Math.random() * 3);

    days.push({
      date: date.toISOString(),
      dayName: i === 0 ? 'Today' : dayNames[date.getDay()],
      high,
      low,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitationProbability: Math.floor(Math.random() * 60),
      sunrise: '06:30',
      sunset: '19:45',
      uvIndex: Math.floor(1 + Math.random() * 10),
      humidity: Math.floor(40 + Math.random() * 40),
    });
  }
  return days;
};

const calculateSunPosition = (): number => {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  const sunrise = 6.5; // 6:30 AM
  const sunset = 19.75; // 7:45 PM

  if (hours < sunrise || hours > sunset) return hours < sunrise ? 0 : 1;
  return (hours - sunrise) / (sunset - sunrise);
};

export const generateWeatherData = (city: CityLocation): WeatherData => {
  // Base temperature varies by city
  const baseTempByCity: Record<string, number> = {
    'new-york': 18,
    'london': 14,
    'tokyo': 22,
    'paris': 16,
    'sydney': 24,
    'dubai': 35,
    'singapore': 30,
    'los-angeles': 26,
  };

  const baseTemp = baseTempByCity[city.id] || 20;
  const conditions = ['clear', 'sunny', 'partly-cloudy', 'cloudy'] as const;
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    location: city,
    current: {
      temperature: baseTemp,
      feelsLike: baseTemp - 1,
      high: baseTemp + 4,
      low: baseTemp - 5,
      condition,
      description: condition === 'clear' ? 'Clear skies' : condition === 'sunny' ? 'Sunny' : condition === 'partly-cloudy' ? 'Partly cloudy' : 'Cloudy',
      humidity: Math.floor(45 + Math.random() * 30),
      uvIndex: Math.floor(1 + Math.random() * 10),
      visibility: Math.floor(8 + Math.random() * 7),
      pressure: Math.floor(1010 + Math.random() * 20),
      windSpeed: Math.floor(8 + Math.random() * 20),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      dewPoint: baseTemp - 8,
      cloudCover: Math.floor(Math.random() * 50),
    },
    hourly: generateHourlyForecast(baseTemp),
    daily: generateDailyForecast(baseTemp),
    sun: {
      sunrise: '06:30',
      sunset: '19:45',
      currentPosition: calculateSunPosition(),
    },
    lastUpdated: new Date().toISOString(),
    alerts: Math.random() > 0.8 ? [{
      id: '1',
      type: 'advisory',
      title: 'Heat Advisory',
      description: 'High temperatures expected throughout the day. Stay hydrated and avoid prolonged sun exposure.',
      severity: 'moderate',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }] : undefined,
  };
};
