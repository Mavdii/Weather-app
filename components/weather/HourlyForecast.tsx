import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { HourlyForecast as HourlyForecastType } from '@/types/weather';

interface HourlyItemProps {
  hour: HourlyForecastType;
  index: number;
  isNow: boolean;
}

function HourlyItem({ hour, index, isNow }: HourlyItemProps) {
  const { formatTemperature } = useWeather();
  const { theme } = useTheme();

  const time = new Date(hour.time);
  const hours = time.getHours();
  const timeString = isNow ? 'Now' : `${hours}:00`;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).duration(400)}
      style={[
        styles.hourItem,
        isNow && { backgroundColor: theme.accent + '30' },
      ]}
    >
      <AnimatedText
        variant="caption"
        color={isNow ? 'accent' : 'secondary'}
        style={styles.time}
      >
        {timeString}
      </AnimatedText>
      <WeatherIcon condition={hour.condition} size={32} animated={false} />
      <AnimatedText variant="body" color="primary" style={styles.temp}>
        {formatTemperature(hour.temperature)}
      </AnimatedText>
      {hour.precipitationProbability > 0 && (
        <AnimatedText variant="caption" color="secondary">
          {`${hour.precipitationProbability}%`}
        </AnimatedText>
      )}
    </Animated.View>
  );
}

export function HourlyForecastSection() {
  const { weatherData } = useWeather();
  const { theme } = useTheme();

  if (!weatherData?.hourly) return null;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(400).duration(400)}>
        <AnimatedText variant="subtitle" color="primary" style={styles.title}>
          Hourly Forecast
        </AnimatedText>
      </Animated.View>
      <GlassCard style={styles.card} padding={16} borderRadius={20}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {weatherData.hourly.slice(0, 24).map((hour, index) => (
            <HourlyItem
              key={`hour-${index}`}
              hour={hour}
              index={index}
              isNow={index === 0}
            />
          ))}
        </ScrollView>
      </GlassCard>
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
  card: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 4,
  },
  hourItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    minWidth: 70,
    gap: 8,
  },
  time: {
    fontWeight: '500',
  },
  temp: {
    fontWeight: '600',
  },
});
