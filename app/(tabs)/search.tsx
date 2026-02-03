import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { IconButton } from '@/components/ui/IconButton';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { weatherService } from '@/services/weatherService';
import { SearchSuggestion, CityLocation } from '@/types/weather';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    fetchWeatherForCity,
    fetchWeatherForLocation,
  } = useWeather();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await weatherService.searchCities(searchQuery);
      setSuggestions(results);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelectCity = useCallback(async (city: SearchSuggestion | CityLocation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();

    const cityLocation: CityLocation = {
      id: city.id,
      name: city.name,
      country: city.country,
      region: city.region,
      coordinates: city.coordinates,
      timezone: 'timezone' in city ? city.timezone : 'UTC',
    };

    await addRecentSearch(cityLocation);
    await fetchWeatherForCity(city.id);
    router.back();
  }, [addRecentSearch, fetchWeatherForCity]);

  const handleCurrentLocation = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    await fetchWeatherForLocation();
    router.back();
  }, [fetchWeatherForLocation]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSuggestions([]);
  }, []);

  return (
    <GradientBackground style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.content, { paddingTop: insets.top + 16 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            name="arrow-back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <AnimatedText variant="title" color="primary">
            Search
          </AnimatedText>
          <View style={{ width: 44 }} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search for a city..."
            isLoading={isSearching}
          />
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          onPress={handleCurrentLocation}
          activeOpacity={0.8}
          style={styles.locationButton}
        >
          <GlassCard style={styles.locationCard} padding={16} borderRadius={16}>
            <View style={styles.locationContent}>
              <Ionicons name="navigate" size={24} color={theme.accent} />
              <View style={styles.locationText}>
                <AnimatedText variant="body" color="primary">
                  Use Current Location
                </AnimatedText>
                <AnimatedText variant="caption" color="secondary">
                  Get weather for your location
                </AnimatedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </View>
          </GlassCard>
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <AnimatedText
                variant="subtitle"
                color="primary"
                style={styles.sectionTitle}
              >
                Search Results
              </AnimatedText>
              <GlassCard style={styles.listCard} padding={0} borderRadius={16}>
                {suggestions.map((city, index) => (
                  <TouchableOpacity
                    key={city.id}
                    onPress={() => handleSelectCity(city)}
                    activeOpacity={0.7}
                    style={[
                      styles.cityItem,
                      index > 0 && {
                        borderTopWidth: 1,
                        borderTopColor: theme.glassBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="location-outline"
                      size={22}
                      color={theme.textSecondary}
                    />
                    <View style={styles.cityInfo}>
                      <AnimatedText variant="body" color="primary">
                        {city.name}
                      </AnimatedText>
                      <AnimatedText variant="caption" color="secondary">
                        {city.region ? `${city.region}, ` : ''}{city.country}
                      </AnimatedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </GlassCard>
            </Animated.View>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && searchQuery.length === 0 && (
            <Animated.View entering={FadeInDown.delay(100).duration(300)}>
              <View style={styles.sectionHeader}>
                <AnimatedText
                  variant="subtitle"
                  color="primary"
                  style={styles.sectionTitle}
                >
                  Recent Searches
                </AnimatedText>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <AnimatedText variant="caption" color="secondary">
                    Clear All
                  </AnimatedText>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
              >
                {recentSearches.slice(0, 10).map((city, index) => (
                  <Animated.View
                    key={city.id}
                    entering={FadeInDown.delay(index * 50).duration(300)}
                  >
                    <TouchableOpacity
                      onPress={() => handleSelectCity(city)}
                      activeOpacity={0.7}
                    >
                      <GlassCard
                        style={styles.recentCard}
                        padding={14}
                        borderRadius={14}
                      >
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color={theme.textSecondary}
                        />
                        <AnimatedText
                          variant="body"
                          color="primary"
                          style={styles.recentName}
                        >
                          {city.name}
                        </AnimatedText>
                        <AnimatedText variant="caption" color="secondary">
                          {city.country}
                        </AnimatedText>
                      </GlassCard>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Popular Cities */}
          {searchQuery.length === 0 && (
            <Animated.View entering={FadeInDown.delay(200).duration(300)}>
              <AnimatedText
                variant="subtitle"
                color="primary"
                style={styles.sectionTitle}
              >
                Popular Cities
              </AnimatedText>
              <GlassCard style={styles.listCard} padding={0} borderRadius={16}>
                {weatherService.getAllCities().slice(0, 6).map((city, index) => (
                  <TouchableOpacity
                    key={city.id}
                    onPress={() => handleSelectCity(city)}
                    activeOpacity={0.7}
                    style={[
                      styles.cityItem,
                      index > 0 && {
                        borderTopWidth: 1,
                        borderTopColor: theme.glassBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={22}
                      color={theme.textSecondary}
                    />
                    <View style={styles.cityInfo}>
                      <AnimatedText variant="body" color="primary">
                        {city.name}
                      </AnimatedText>
                      <AnimatedText variant="caption" color="secondary">
                        {city.country}
                      </AnimatedText>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </GlassCard>
            </Animated.View>
          )}
        </ScrollView>
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
  backButton: {},
  searchContainer: {
    marginBottom: 16,
  },
  locationButton: {
    marginBottom: 24,
  },
  locationCard: {},
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  locationText: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  listCard: {
    marginBottom: 24,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  cityInfo: {
    flex: 1,
  },
  recentList: {
    gap: 12,
    paddingBottom: 24,
  },
  recentCard: {
    alignItems: 'center',
    minWidth: 100,
    gap: 6,
  },
  recentName: {
    fontWeight: '500',
  },
});
