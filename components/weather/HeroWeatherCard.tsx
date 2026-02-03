import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export function HeroWeatherCard() {
  const { weatherData, formatTemperature, selectedCity } = useWeather();
  const { theme } = useTheme();

  if (!weatherData) return null;

  const { current, location } = weatherData;

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(600)}>
      <GlassCard style={styles.card} padding={24} borderRadius={28}>
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color={theme.textSecondary} />
            <AnimatedText variant="subtitle" color="secondary" style={styles.location}>
              {location.name}
            </AnimatedText>
          </View>
          <AnimatedText variant="caption" color="secondary">
            {location.country}
          </AnimatedText>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.tempContainer}>
            <AnimatedText variant="hero" color="primary">
              {formatTemperature(current.temperature).replace(/[°CF]/g, '')}
            </AnimatedText>
            <AnimatedText variant="title" color="secondary" style={styles.unit}>
              °
            </AnimatedText>
          </View>

          <WeatherIcon condition={current.condition} size={100} animated />
        </View>

        <View style={styles.details}>
          <AnimatedText variant="title" color="primary" style={styles.description}>
            {current.description}
          </AnimatedText>

          <View style={styles.highLow}>
            <View style={styles.tempDetail}>
              <Ionicons name="arrow-up" size={16} color={theme.accent} />
              <AnimatedText variant="body" color="primary">
                H: {formatTemperature(current.high)}
              </AnimatedText>
            </View>
            <View style={styles.tempDetail}>
              <Ionicons name="arrow-down" size={16} color={theme.textSecondary} />
              <AnimatedText variant="body" color="primary">
                L: {formatTemperature(current.low)}
              </AnimatedText>
            </View>
          </View>

          <View style={styles.feelsLike}>
            <AnimatedText variant="body" color="secondary">
              Feels like {formatTemperature(current.feelsLike)}
            </AnimatedText>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    marginLeft: 4,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unit: {
    marginTop: 12,
  },
  details: {
    alignItems: 'center',
    gap: 8,
  },
  description: {
    textAlign: 'center',
  },
  highLow: {
    flexDirection: 'row',
    gap: 20,
  },
  tempDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feelsLike: {
    marginTop: 4,
  },
});
