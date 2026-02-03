import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { IconButton } from '@/components/ui/IconButton';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MapOverlay } from '@/types/weather';

// Conditionally import react-native-maps only on native platforms
let MapView: React.ComponentType<any> | null = null;
let Marker: React.ComponentType<any> | null = null;
let UrlTile: React.ComponentType<any> | null = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  UrlTile = Maps.UrlTile;
  PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
}

const overlayOptions: { id: MapOverlay; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'none', label: 'None', icon: 'close-circle-outline' },
  { id: 'precipitation', label: 'Rain', icon: 'rainy' },
  { id: 'temperature', label: 'Temp', icon: 'thermometer' },
  { id: 'wind', label: 'Wind', icon: 'flag' },
  { id: 'clouds', label: 'Clouds', icon: 'cloudy' },
];

// OpenWeatherMap tile URLs (free tier available)
const getOverlayUrl = (overlay: MapOverlay): string | null => {
  // Note: In production, you'd use your own API key
  // These are placeholder URLs showing the structure
  const baseUrl = 'https://tile.openweathermap.org/map';
  const apiKey = 'demo'; // Replace with actual API key in production

  switch (overlay) {
    case 'precipitation':
      return `${baseUrl}/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
    case 'temperature':
      return `${baseUrl}/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`;
    case 'wind':
      return `${baseUrl}/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`;
    case 'clouds':
      return `${baseUrl}/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`;
    default:
      return null;
  }
};

// Web fallback component when Maps is not available
function WebMapFallback() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { weatherData, selectedCity, formatTemperature } = useWeather();

  const openExternalMap = useCallback(() => {
    if (selectedCity) {
      const url = `https://www.google.com/maps/search/?api=1&query=${selectedCity.coordinates.latitude},${selectedCity.coordinates.longitude}`;
      Linking.openURL(url);
    }
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <GradientBackground />
      <ScrollView
        style={styles.webScrollView}
        contentContainerStyle={[
          styles.webContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <GlassCard style={styles.webHeader} padding={20} borderRadius={20}>
            <Ionicons name="map" size={48} color={theme.accent} />
            <AnimatedText variant="title" color="primary" style={styles.webTitle}>
              Weather Map
            </AnimatedText>
            <AnimatedText variant="body" color="secondary" style={styles.webSubtitle}>
              Interactive maps are available on the mobile app
            </AnimatedText>
          </GlassCard>
        </Animated.View>

        {/* Location Info */}
        {selectedCity && weatherData && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <GlassCard padding={20} borderRadius={20}>
              <View style={styles.webLocationHeader}>
                <Ionicons name="location" size={24} color={theme.accent} />
                <AnimatedText variant="subtitle" color="primary">
                  Current Location
                </AnimatedText>
              </View>

              <View style={styles.webLocationDetails}>
                <View style={styles.webLocationInfo}>
                  <AnimatedText variant="title" color="primary">
                    {selectedCity.name}
                  </AnimatedText>
                  <AnimatedText variant="caption" color="secondary">
                    {selectedCity.country}
                  </AnimatedText>
                </View>
                <View style={styles.webWeatherInfo}>
                  <AnimatedText variant="hero" color="primary">
                    {formatTemperature(weatherData.current.temperature)}
                  </AnimatedText>
                  <AnimatedText variant="caption" color="secondary">
                    {weatherData.current.description}
                  </AnimatedText>
                </View>
              </View>

              <View style={styles.webCoordinates}>
                <View style={styles.webCoordItem}>
                  <AnimatedText variant="caption" color="secondary">
                    Latitude
                  </AnimatedText>
                  <AnimatedText variant="body" color="primary">
                    {selectedCity.coordinates.latitude.toFixed(4)}°
                  </AnimatedText>
                </View>
                <View style={styles.webCoordItem}>
                  <AnimatedText variant="caption" color="secondary">
                    Longitude
                  </AnimatedText>
                  <AnimatedText variant="body" color="primary">
                    {selectedCity.coordinates.longitude.toFixed(4)}°
                  </AnimatedText>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.webMapButton, { backgroundColor: theme.accent }]}
                onPress={openExternalMap}
                activeOpacity={0.8}
              >
                <Ionicons name="open-outline" size={20} color="#fff" />
                <AnimatedText variant="body" style={styles.webButtonText}>
                  Open in Google Maps
                </AnimatedText>
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>
        )}

        {/* Weather Layers Info */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <GlassCard padding={20} borderRadius={20}>
            <AnimatedText variant="subtitle" color="primary" style={styles.webSectionTitle}>
              Weather Layers
            </AnimatedText>
            <AnimatedText variant="body" color="secondary" style={styles.webDescription}>
              On the mobile app, you can view interactive weather layers including:
            </AnimatedText>
            <View style={styles.webLayersList}>
              {overlayOptions.filter(o => o.id !== 'none').map((option) => (
                <View key={option.id} style={styles.webLayerItem}>
                  <Ionicons name={option.icon} size={24} color={theme.accent} />
                  <AnimatedText variant="body" color="primary">
                    {option.label}
                  </AnimatedText>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { weatherData, selectedCity, formatTemperature } = useWeather();
  const mapRef = useRef<any>(null);

  const [selectedOverlay, setSelectedOverlay] = useState<MapOverlay>('none');

  const initialRegion = selectedCity
    ? {
        latitude: selectedCity.coordinates.latitude,
        longitude: selectedCity.coordinates.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }
    : {
        latitude: 40.7128,
        longitude: -74.006,
        latitudeDelta: 10,
        longitudeDelta: 10,
      };

  const handleOverlaySelect = useCallback((overlay: MapOverlay) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedOverlay(overlay);
  }, []);

  const handleCenterOnCity = useCallback(() => {
    if (selectedCity && mapRef.current) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      mapRef.current.animateToRegion({
        latitude: selectedCity.coordinates.latitude,
        longitude: selectedCity.coordinates.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      });
    }
  }, [selectedCity]);

  const overlayUrl = getOverlayUrl(selectedOverlay);

  // Show web fallback on web platform
  if (Platform.OS === 'web' || !MapView) {
    return <WebMapFallback />;
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        showsMyLocationButton={false}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
      >
        {/* Weather overlay tiles */}
        {overlayUrl && UrlTile && (
          <UrlTile
            urlTemplate={overlayUrl}
            maximumZ={19}
            flipY={false}
            opacity={0.6}
          />
        )}

        {/* City marker */}
        {selectedCity && weatherData && Marker && (
          <Marker
            coordinate={{
              latitude: selectedCity.coordinates.latitude,
              longitude: selectedCity.coordinates.longitude,
            }}
            title={selectedCity.name}
            description={`${formatTemperature(weatherData.current.temperature)} - ${weatherData.current.description}`}
          />
        )}
      </MapView>

      {/* Header overlay */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <GlassCard style={styles.titleCard} padding={12} borderRadius={16}>
          <AnimatedText variant="subtitle" color="primary">
            Weather Map
          </AnimatedText>
        </GlassCard>

        <IconButton
          name="locate"
          onPress={handleCenterOnCity}
          style={styles.locateButton}
        />
      </Animated.View>

      {/* Weather info card */}
      {weatherData && selectedCity && (
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.infoCardContainer, { bottom: insets.bottom + 100 }]}
        >
          <GlassCard style={styles.infoCard} padding={16} borderRadius={20}>
            <View style={styles.infoContent}>
              <View style={styles.infoLeft}>
                <AnimatedText variant="title" color="primary">
                  {selectedCity.name}
                </AnimatedText>
                <AnimatedText variant="caption" color="secondary">
                  {selectedCity.country}
                </AnimatedText>
              </View>
              <View style={styles.infoRight}>
                <AnimatedText variant="title" color="primary">
                  {formatTemperature(weatherData.current.temperature)}
                </AnimatedText>
                <AnimatedText variant="caption" color="secondary">
                  {weatherData.current.description}
                </AnimatedText>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      )}

      {/* Overlay selector */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={[styles.overlaySelector, { bottom: insets.bottom + 180 }]}
      >
        <GlassCard style={styles.overlayCard} padding={12} borderRadius={16}>
          <AnimatedText
            variant="caption"
            color="secondary"
            style={styles.overlayTitle}
          >
            WEATHER LAYERS
          </AnimatedText>
          <View style={styles.overlayOptions}>
            {overlayOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOverlaySelect(option.id)}
                style={[
                  styles.overlayOption,
                  selectedOverlay === option.id && {
                    backgroundColor: theme.accent + '40',
                    borderColor: theme.accent,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={
                    selectedOverlay === option.id
                      ? theme.accent
                      : theme.textSecondary
                  }
                />
                <AnimatedText
                  variant="caption"
                  color={selectedOverlay === option.id ? 'accent' : 'secondary'}
                >
                  {option.label}
                </AnimatedText>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>
      </Animated.View>

      {/* Overlay active indicator */}
      {selectedOverlay !== 'none' && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[styles.overlayIndicator, { top: insets.top + 70 }]}
        >
          <GlassCard style={styles.indicatorCard} padding={10} borderRadius={12}>
            <AnimatedText variant="caption" color="primary">
              {`${overlayOptions.find((o) => o.id === selectedOverlay)?.label ?? ''} Layer Active`}
            </AnimatedText>
          </GlassCard>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  titleCard: {},
  locateButton: {},
  infoCardContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
  },
  infoCard: {},
  infoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {},
  infoRight: {
    alignItems: 'flex-end',
  },
  overlaySelector: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
  },
  overlayCard: {},
  overlayTitle: {
    marginBottom: 10,
    letterSpacing: 1,
  },
  overlayOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  overlayOption: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
    flex: 1,
  },
  overlayIndicator: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  indicatorCard: {},
  // Web fallback styles
  webScrollView: {
    flex: 1,
  },
  webContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  webHeader: {
    alignItems: 'center',
    gap: 12,
  },
  webTitle: {
    textAlign: 'center',
  },
  webSubtitle: {
    textAlign: 'center',
  },
  webLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  webLocationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  webLocationInfo: {
    flex: 1,
  },
  webWeatherInfo: {
    alignItems: 'flex-end',
  },
  webCoordinates: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  webCoordItem: {
    flex: 1,
  },
  webMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  webButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  webSectionTitle: {
    marginBottom: 12,
  },
  webDescription: {
    marginBottom: 16,
  },
  webLayersList: {
    gap: 12,
  },
  webLayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
