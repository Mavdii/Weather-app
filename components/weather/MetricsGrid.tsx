import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';

interface MetricItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  subtitle?: string;
  delay: number;
}

function MetricItem({ icon, label, value, subtitle, delay }: MetricItemProps) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500)}
      style={styles.metricItem}
    >
      <GlassCard style={styles.metricCard} padding={16} borderRadius={16}>
        <View style={styles.metricHeader}>
          <Ionicons name={icon} size={20} color={theme.textSecondary} />
          <AnimatedText variant="caption" color="secondary">
            {label}
          </AnimatedText>
        </View>
        <AnimatedText variant="title" color="primary" style={styles.metricValue}>
          {value}
        </AnimatedText>
        {subtitle && (
          <AnimatedText variant="caption" color="secondary">
            {subtitle}
          </AnimatedText>
        )}
      </GlassCard>
    </Animated.View>
  );
}

export function MetricsGrid() {
  const { weatherData, formatSpeed } = useWeather();
  const { theme } = useTheme();

  if (!weatherData) return null;

  const { current } = weatherData;

  const getUVLevel = (uvIndex: number): string => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  const metrics = [
    {
      icon: 'water' as const,
      label: 'HUMIDITY',
      value: `${current.humidity}%`,
      subtitle: current.humidity > 60 ? 'High' : current.humidity < 30 ? 'Low' : 'Normal',
    },
    {
      icon: 'sunny' as const,
      label: 'UV INDEX',
      value: `${current.uvIndex}`,
      subtitle: getUVLevel(current.uvIndex),
    },
    {
      icon: 'eye' as const,
      label: 'VISIBILITY',
      value: `${current.visibility} km`,
      subtitle: current.visibility > 10 ? 'Clear' : current.visibility > 5 ? 'Good' : 'Poor',
    },
    {
      icon: 'speedometer' as const,
      label: 'PRESSURE',
      value: `${current.pressure}`,
      subtitle: 'hPa',
    },
    {
      icon: 'flag' as const,
      label: 'WIND',
      value: formatSpeed(current.windSpeed),
      subtitle: current.windDirection,
    },
    {
      icon: 'thermometer' as const,
      label: 'DEW POINT',
      value: `${current.dewPoint}°`,
      subtitle: 'Temperature',
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(200).duration(400)}>
        <AnimatedText variant="subtitle" color="primary" style={styles.title}>
          Weather Details
        </AnimatedText>
      </Animated.View>
      <View style={styles.grid}>
        {metrics.map((metric, index) => (
          <MetricItem
            key={metric.label}
            {...metric}
            delay={300 + index * 100}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricItem: {
    width: '48%',
  },
  metricCard: {
    height: 100,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metricValue: {
    marginBottom: 2,
  },
});
