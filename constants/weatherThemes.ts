import { WeatherCondition } from '@/types/weather';

export interface WeatherTheme {
  gradientColors: string[];
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  glassBackground: string;
  glassBorder: string;
}

export interface ThemeColors {
  light: WeatherTheme;
  dark: WeatherTheme;
}

export const weatherThemesByCondition: Record<WeatherCondition, ThemeColors> = {
  clear: {
    light: {
      gradientColors: ['#87CEEB', '#4A90D9', '#2E5BBA'],
      cardBackground: 'rgba(255, 255, 255, 0.25)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: '#FFD700',
      glassBackground: 'rgba(255, 255, 255, 0.2)',
      glassBorder: 'rgba(255, 255, 255, 0.3)',
    },
    dark: {
      gradientColors: ['#1a1a2e', '#16213e', '#0f3460'],
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#FFD700',
      glassBackground: 'rgba(255, 255, 255, 0.08)',
      glassBorder: 'rgba(255, 255, 255, 0.15)',
    },
  },
  sunny: {
    light: {
      gradientColors: ['#FFD89B', '#F9A825', '#FF8F00'],
      cardBackground: 'rgba(255, 255, 255, 0.3)',
      textPrimary: '#1a1a2e',
      textSecondary: 'rgba(26, 26, 46, 0.8)',
      accent: '#FF6B00',
      glassBackground: 'rgba(255, 255, 255, 0.25)',
      glassBorder: 'rgba(255, 255, 255, 0.4)',
    },
    dark: {
      gradientColors: ['#2d1f3d', '#1a1a2e', '#0f0f1e'],
      cardBackground: 'rgba(255, 200, 100, 0.1)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#FFD700',
      glassBackground: 'rgba(255, 200, 100, 0.08)',
      glassBorder: 'rgba(255, 200, 100, 0.15)',
    },
  },
  'partly-cloudy': {
    light: {
      gradientColors: ['#A8D8EA', '#86B4D3', '#5B9BD5'],
      cardBackground: 'rgba(255, 255, 255, 0.3)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.85)',
      accent: '#FFE082',
      glassBackground: 'rgba(255, 255, 255, 0.22)',
      glassBorder: 'rgba(255, 255, 255, 0.35)',
    },
    dark: {
      gradientColors: ['#2c3e50', '#1a252f', '#0d1318'],
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.65)',
      accent: '#90CAF9',
      glassBackground: 'rgba(255, 255, 255, 0.06)',
      glassBorder: 'rgba(255, 255, 255, 0.12)',
    },
  },
  cloudy: {
    light: {
      gradientColors: ['#B0BEC5', '#90A4AE', '#78909C'],
      cardBackground: 'rgba(255, 255, 255, 0.35)',
      textPrimary: '#263238',
      textSecondary: 'rgba(38, 50, 56, 0.75)',
      accent: '#546E7A',
      glassBackground: 'rgba(255, 255, 255, 0.28)',
      glassBorder: 'rgba(255, 255, 255, 0.4)',
    },
    dark: {
      gradientColors: ['#37474F', '#263238', '#1a2327'],
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#ECEFF1',
      textSecondary: 'rgba(236, 239, 241, 0.7)',
      accent: '#78909C',
      glassBackground: 'rgba(255, 255, 255, 0.06)',
      glassBorder: 'rgba(255, 255, 255, 0.1)',
    },
  },
  overcast: {
    light: {
      gradientColors: ['#9E9E9E', '#757575', '#616161'],
      cardBackground: 'rgba(255, 255, 255, 0.3)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: '#B0BEC5',
      glassBackground: 'rgba(255, 255, 255, 0.25)',
      glassBorder: 'rgba(255, 255, 255, 0.35)',
    },
    dark: {
      gradientColors: ['#424242', '#303030', '#212121'],
      cardBackground: 'rgba(255, 255, 255, 0.07)',
      textPrimary: '#E0E0E0',
      textSecondary: 'rgba(224, 224, 224, 0.65)',
      accent: '#757575',
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
    },
  },
  rain: {
    light: {
      gradientColors: ['#667eea', '#4A5568', '#2D3748'],
      cardBackground: 'rgba(255, 255, 255, 0.2)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: '#63B3ED',
      glassBackground: 'rgba(255, 255, 255, 0.15)',
      glassBorder: 'rgba(255, 255, 255, 0.25)',
    },
    dark: {
      gradientColors: ['#1e3a5f', '#152238', '#0a1628'],
      cardBackground: 'rgba(99, 179, 237, 0.12)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#63B3ED',
      glassBackground: 'rgba(99, 179, 237, 0.08)',
      glassBorder: 'rgba(99, 179, 237, 0.15)',
    },
  },
  'heavy-rain': {
    light: {
      gradientColors: ['#4A5568', '#2D3748', '#1A202C'],
      cardBackground: 'rgba(255, 255, 255, 0.18)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.75)',
      accent: '#4299E1',
      glassBackground: 'rgba(255, 255, 255, 0.12)',
      glassBorder: 'rgba(255, 255, 255, 0.2)',
    },
    dark: {
      gradientColors: ['#1a202c', '#171923', '#0d0f14'],
      cardBackground: 'rgba(66, 153, 225, 0.1)',
      textPrimary: '#E2E8F0',
      textSecondary: 'rgba(226, 232, 240, 0.65)',
      accent: '#4299E1',
      glassBackground: 'rgba(66, 153, 225, 0.06)',
      glassBorder: 'rgba(66, 153, 225, 0.12)',
    },
  },
  thunderstorm: {
    light: {
      gradientColors: ['#4B0082', '#2F0743', '#1a0a2e'],
      cardBackground: 'rgba(255, 255, 255, 0.15)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.75)',
      accent: '#F6E05E',
      glassBackground: 'rgba(255, 255, 255, 0.1)',
      glassBorder: 'rgba(255, 255, 255, 0.18)',
    },
    dark: {
      gradientColors: ['#1a0a2e', '#0f0618', '#050208'],
      cardBackground: 'rgba(246, 224, 94, 0.08)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#F6E05E',
      glassBackground: 'rgba(246, 224, 94, 0.05)',
      glassBorder: 'rgba(246, 224, 94, 0.1)',
    },
  },
  snow: {
    light: {
      gradientColors: ['#E8EAF6', '#C5CAE9', '#9FA8DA'],
      cardBackground: 'rgba(255, 255, 255, 0.4)',
      textPrimary: '#3F51B5',
      textSecondary: 'rgba(63, 81, 181, 0.75)',
      accent: '#7986CB',
      glassBackground: 'rgba(255, 255, 255, 0.35)',
      glassBorder: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
      gradientColors: ['#283593', '#1a237e', '#0d1257'],
      cardBackground: 'rgba(255, 255, 255, 0.12)',
      textPrimary: '#E8EAF6',
      textSecondary: 'rgba(232, 234, 246, 0.75)',
      accent: '#9FA8DA',
      glassBackground: 'rgba(255, 255, 255, 0.08)',
      glassBorder: 'rgba(255, 255, 255, 0.15)',
    },
  },
  fog: {
    light: {
      gradientColors: ['#CFD8DC', '#B0BEC5', '#90A4AE'],
      cardBackground: 'rgba(255, 255, 255, 0.35)',
      textPrimary: '#37474F',
      textSecondary: 'rgba(55, 71, 79, 0.75)',
      accent: '#78909C',
      glassBackground: 'rgba(255, 255, 255, 0.3)',
      glassBorder: 'rgba(255, 255, 255, 0.45)',
    },
    dark: {
      gradientColors: ['#455A64', '#37474F', '#263238'],
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      textPrimary: '#CFD8DC',
      textSecondary: 'rgba(207, 216, 220, 0.7)',
      accent: '#90A4AE',
      glassBackground: 'rgba(255, 255, 255, 0.07)',
      glassBorder: 'rgba(255, 255, 255, 0.12)',
    },
  },
  mist: {
    light: {
      gradientColors: ['#E0E0E0', '#BDBDBD', '#9E9E9E'],
      cardBackground: 'rgba(255, 255, 255, 0.35)',
      textPrimary: '#424242',
      textSecondary: 'rgba(66, 66, 66, 0.75)',
      accent: '#757575',
      glassBackground: 'rgba(255, 255, 255, 0.3)',
      glassBorder: 'rgba(255, 255, 255, 0.45)',
    },
    dark: {
      gradientColors: ['#424242', '#303030', '#212121'],
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#E0E0E0',
      textSecondary: 'rgba(224, 224, 224, 0.65)',
      accent: '#9E9E9E',
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(255, 255, 255, 0.1)',
    },
  },
  windy: {
    light: {
      gradientColors: ['#81D4FA', '#4FC3F7', '#29B6F6'],
      cardBackground: 'rgba(255, 255, 255, 0.28)',
      textPrimary: '#01579B',
      textSecondary: 'rgba(1, 87, 155, 0.75)',
      accent: '#0288D1',
      glassBackground: 'rgba(255, 255, 255, 0.22)',
      glassBorder: 'rgba(255, 255, 255, 0.38)',
    },
    dark: {
      gradientColors: ['#01579B', '#0277BD', '#01579B'],
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      textPrimary: '#E1F5FE',
      textSecondary: 'rgba(225, 245, 254, 0.7)',
      accent: '#4FC3F7',
      glassBackground: 'rgba(255, 255, 255, 0.07)',
      glassBorder: 'rgba(255, 255, 255, 0.12)',
    },
  },
  hail: {
    light: {
      gradientColors: ['#607D8B', '#546E7A', '#455A64'],
      cardBackground: 'rgba(255, 255, 255, 0.25)',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: '#90A4AE',
      glassBackground: 'rgba(255, 255, 255, 0.2)',
      glassBorder: 'rgba(255, 255, 255, 0.3)',
    },
    dark: {
      gradientColors: ['#37474F', '#263238', '#1c2529'],
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#ECEFF1',
      textSecondary: 'rgba(236, 239, 241, 0.65)',
      accent: '#78909C',
      glassBackground: 'rgba(255, 255, 255, 0.05)',
      glassBorder: 'rgba(255, 255, 255, 0.1)',
    },
  },
};

export const defaultSettings = {
  temperatureUnit: 'celsius' as const,
  speedUnit: 'kmh' as const,
  themeMode: 'system' as const,
  notificationsEnabled: true,
  severeWeatherAlerts: true,
};
