import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { IconButton } from '@/components/ui/IconButton';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FavoriteCity, WeatherData } from '@/types/weather';
import { weatherService } from '@/services/weatherService';

interface FavoriteCardProps {
  city: FavoriteCity;
  weather: WeatherData | null;
  isLoading: boolean;
  onPress: () => void;
  onRemove: () => void;
}

function FavoriteCard({ city, weather, isLoading, onPress, onRemove }: FavoriteCardProps) {
  const { theme } = useTheme();
  const { formatTemperature } = useWeather();

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Remove Favorite',
      `Remove ${city.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ]
    );
  }, [city.name, onRemove]);

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeInDown.duration(400)}
      exiting={FadeOut.duration(200)}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
      >
        <GlassCard style={styles.favoriteCard} padding={16} borderRadius={20}>
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <AnimatedText variant="title" color="primary">
                {city.name}
              </AnimatedText>
              <AnimatedText variant="caption" color="secondary">
                {city.region ? `${city.region}, ` : ''}{city.country}
              </AnimatedText>
              {weather && (
                <AnimatedText variant="body" color="secondary" style={styles.description}>
                  {weather.current.description}
                </AnimatedText>
              )}
            </View>

            <View style={styles.cardRight}>
              {weather ? (
                <>
                  <WeatherIcon
                    condition={weather.current.condition}
                    size={48}
                    animated={false}
                  />
                  <AnimatedText variant="title" color="primary" style={styles.temp}>
                    {formatTemperature(weather.current.temperature)}
                  </AnimatedText>
                  <View style={styles.highLow}>
                    <AnimatedText variant="caption" color="secondary">
                      H:{formatTemperature(weather.current.high)}
                    </AnimatedText>
                    <AnimatedText variant="caption" color="secondary">
                      L:{formatTemperature(weather.current.low)}
                    </AnimatedText>
                  </View>
                </>
              ) : isLoading ? (
                <AnimatedText variant="caption" color="secondary">
                  Loading...
                </AnimatedText>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            onPress={onRemove}
            style={[styles.removeButton, { backgroundColor: theme.glassBackground }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    favorites,
    removeFromFavorites,
    fetchWeatherForCity,
  } = useWeather();

  const [favoriteWeather, setFavoriteWeather] = useState<Record<string, WeatherData>>({});
  const [loadingCities, setLoadingCities] = useState<Set<string>>(new Set());

  // Fetch weather for all favorites
  useEffect(() => {
    const fetchAllWeather = async () => {
      for (const city of favorites) {
        if (!favoriteWeather[city.id] && !loadingCities.has(city.id)) {
          setLoadingCities((prev) => new Set([...prev, city.id]));
          try {
            const weather = await weatherService.getWeatherForCity(city.id);
            setFavoriteWeather((prev) => ({ ...prev, [city.id]: weather }));
          } catch (error) {
            console.error(`Error fetching weather for ${city.name}:`, error);
          } finally {
            setLoadingCities((prev) => {
              const next = new Set(prev);
              next.delete(city.id);
              return next;
            });
          }
        }
      }
    };

    fetchAllWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  const handleSelectCity = useCallback(async (cityId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchWeatherForCity(cityId);
    router.navigate('/');
  }, [fetchWeatherForCity]);

  const handleRemoveCity = useCallback((cityId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    removeFromFavorites(cityId);
    setFavoriteWeather((prev) => {
      const next = { ...prev };
      delete next[cityId];
      return next;
    });
  }, [removeFromFavorites]);

  return (
    <GradientBackground style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.content, { paddingTop: insets.top + 16 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <AnimatedText variant="title" color="primary">
            Favorites
          </AnimatedText>
          <IconButton
            name="add"
            onPress={() => router.push('/search')}
          />
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <GlassCard style={styles.emptyCard} padding={40} borderRadius={24}>
              <Ionicons name="heart-outline" size={64} color={theme.textSecondary} />
              <AnimatedText
                variant="title"
                color="primary"
                style={styles.emptyTitle}
              >
                No Favorites Yet
              </AnimatedText>
              <AnimatedText
                variant="body"
                color="secondary"
                style={styles.emptyText}
              >
                Save your favorite cities for quick access to their weather
              </AnimatedText>
              <TouchableOpacity
                onPress={() => router.push('/search')}
                style={[styles.addButton, { backgroundColor: theme.accent }]}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <AnimatedText variant="body" style={styles.addButtonText}>
                  Add City
                </AnimatedText>
              </TouchableOpacity>
            </GlassCard>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <AnimatedText variant="caption" color="secondary" style={styles.hint}>
              Long press to remove a city
            </AnimatedText>

            {favorites.map((city, index) => (
              <FavoriteCard
                key={city.id}
                city={city}
                weather={favoriteWeather[city.id] || null}
                isLoading={loadingCities.has(city.id)}
                onPress={() => handleSelectCity(city.id)}
                onRemove={() => handleRemoveCity(city.id)}
              />
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
  },
  hint: {
    marginBottom: 8,
    marginLeft: 4,
  },
  favoriteCard: {
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    paddingRight: 16,
  },
  description: {
    marginTop: 8,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  temp: {
    marginTop: 4,
  },
  highLow: {
    flexDirection: 'row',
    gap: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
