import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DailyForecast } from '@/types/weather';

interface DayItemProps {
  day: DailyForecast;
  index: number;
  minTemp: number;
  maxTemp: number;
}

function DayItem({ day, index, minTemp, maxTemp }: DayItemProps) {
  const { formatTemperature } = useWeather();
  const { theme } = useTheme();

  // Calculate position for temperature bar
  const range = maxTemp - minTemp;
  const lowPosition = ((day.low - minTemp) / range) * 100;
  const highPosition = ((day.high - minTemp) / range) * 100;

  return (
    <Animated.View
      entering={FadeInUp.delay(500 + index * 100).duration(400)}
      style={[
        styles.dayItem,
        index > 0 && { borderTopWidth: 1, borderTopColor: theme.glassBorder },
      ]}
    >
      <AnimatedText variant="body" color="primary" style={styles.dayName}>
        {day.dayName}
      </AnimatedText>

      <View style={styles.precipContainer}>
        {day.precipitationProbability > 0 && (
          <AnimatedText variant="caption" color="secondary">
            {`${day.precipitationProbability}%`}
          </AnimatedText>
        )}
      </View>

      <WeatherIcon condition={day.condition} size={28} animated={false} />

      <AnimatedText variant="body" color="secondary" style={styles.lowTemp}>
        {formatTemperature(day.low)}
      </AnimatedText>

      <View style={styles.tempBar}>
        <View
          style={[
            styles.tempRange,
            {
              left: `${lowPosition}%`,
              right: `${100 - highPosition}%`,
              backgroundColor: theme.accent,
            },
          ]}
        />
      </View>

      <AnimatedText variant="body" color="primary" style={styles.highTemp}>
        {formatTemperature(day.high)}
      </AnimatedText>
    </Animated.View>
  );
}

export function WeeklyForecastSection() {
  const { weatherData } = useWeather();
  const { theme } = useTheme();

  if (!weatherData?.daily) return null;

  const { daily } = weatherData;

  // Calculate min and max temps for the week
  const temps = daily.flatMap((d) => [d.low, d.high]);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(500).duration(400)}>
        <AnimatedText variant="subtitle" color="primary" style={styles.title}>
          7-Day Forecast
        </AnimatedText>
      </Animated.View>
      <GlassCard style={styles.card} padding={16} borderRadius={20}>
        {daily.map((day, index) => (
          <DayItem
            key={`day-${index}`}
            day={day}
            index={index}
            minTemp={minTemp}
            maxTemp={maxTemp}
          />
        ))}
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
    paddingVertical: 8,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  dayName: {
    width: 50,
    fontWeight: '500',
  },
  precipContainer: {
    width: 35,
    alignItems: 'center',
  },
  lowTemp: {
    width: 50,
    textAlign: 'right',
  },
  tempBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  tempRange: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  highTemp: {
    width: 50,
    textAlign: 'left',
    fontWeight: '600',
  },
});
