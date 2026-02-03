import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ErrorState } from '@/components/ui/ErrorState';
import { HeroWeatherCard } from '@/components/weather/HeroWeatherCard';
import { AIWeatherSummary } from '@/components/weather/AIWeatherSummary';
import { WeatherAlertSection } from '@/components/weather/WeatherAlert';
import { MetricsGrid } from '@/components/weather/MetricsGrid';
import { HourlyForecastSection } from '@/components/weather/HourlyForecast';
import { WeeklyForecastSection } from '@/components/weather/WeeklyForecast';
import { SunriseSunsetSection } from '@/components/weather/SunriseSunset';
import { TemperatureChart } from '@/components/weather/TemperatureChart';
import { PrecipitationChart } from '@/components/weather/PrecipitationChart';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    weatherData,
    isLoading,
    error,
    selectedCity,
    fetchWeatherForCity,
    fetchWeatherForLocation,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  } = useWeather();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedCity) {
      await fetchWeatherForCity(selectedCity.id);
    }
    setRefreshing(false);
  }, [selectedCity, fetchWeatherForCity]);

  const handleToggleFavorite = useCallback(() => {
    if (!selectedCity) return;
    if (isFavorite(selectedCity.id)) {
      removeFromFavorites(selectedCity.id);
    } else {
      addToFavorites(selectedCity);
    }
  }, [selectedCity, isFavorite, addToFavorites, removeFromFavorites]);

  const handleLocationPress = useCallback(() => {
    fetchWeatherForLocation();
  }, [fetchWeatherForLocation]);

  if (error && !weatherData) {
    return (
      <GradientBackground style={styles.container}>
        <ErrorState
          title="Weather Unavailable"
          message={error}
          icon="cloud-offline"
          onRetry={() => selectedCity && fetchWeatherForCity(selectedCity.id)}
        />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <LoadingOverlay visible={isLoading && !weatherData} message="Fetching weather..." />

      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <IconButton
          name="search"
          onPress={() => router.push('/search')}
          style={styles.headerButton}
        />
        <View style={styles.headerRight}>
          <IconButton
            name="navigate"
            onPress={handleLocationPress}
            style={styles.headerButton}
          />
          {selectedCity && (
            <IconButton
              name={isFavorite(selectedCity.id) ? 'heart' : 'heart-outline'}
              onPress={handleToggleFavorite}
              color={isFavorite(selectedCity.id) ? '#FF4081' : theme.textPrimary}
              style={styles.headerButton}
            />
          )}
        </View>
      </Animated.View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textPrimary}
          />
        }
      >
        {weatherData && (
          <>
            <WeatherAlertSection />
            <HeroWeatherCard />
            <AIWeatherSummary weatherData={weatherData} />
            <HourlyForecastSection />
            <MetricsGrid />
            <WeeklyForecastSection />
            <SunriseSunsetSection />
            <TemperatureChart />
            <PrecipitationChart />
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerButton: {
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
