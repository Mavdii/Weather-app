import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeMode, TemperatureUnit, SpeedUnit } from '@/types/weather';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

function SettingItem({ icon, title, subtitle, rightElement, onPress }: SettingItemProps) {
  const { theme } = useTheme();

  const content = (
    <View style={styles.settingItem}>
      <View style={[styles.iconContainer, { backgroundColor: theme.accent + '30' }]}>
        <Ionicons name={icon} size={20} color={theme.accent} />
      </View>
      <View style={styles.settingInfo}>
        <AnimatedText variant="body" color="primary">
          {title}
        </AnimatedText>
        {subtitle && (
          <AnimatedText variant="caption" color="secondary">
            {subtitle}
          </AnimatedText>
        )}
      </View>
      {rightElement}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

function SegmentedControl({ options, selected, onSelect }: SegmentedControlProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.segmentedControl, { backgroundColor: theme.glassBackground }]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(option.value);
          }}
          style={[
            styles.segmentOption,
            selected === option.value && { backgroundColor: theme.accent },
          ]}
          activeOpacity={0.7}
        >
          <AnimatedText
            variant="caption"
            style={[
              styles.segmentLabel,
              { color: selected === option.value ? '#FFFFFF' : theme.textSecondary },
            ]}
          >
            {option.label}
          </AnimatedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { settings, updateSettings } = useWeather();

  const handleThemeChange = useCallback((value: string) => {
    setThemeMode(value as ThemeMode);
  }, [setThemeMode]);

  const handleTemperatureUnitChange = useCallback((value: string) => {
    updateSettings({ temperatureUnit: value as TemperatureUnit });
  }, [updateSettings]);

  const handleSpeedUnitChange = useCallback((value: string) => {
    updateSettings({ speedUnit: value as SpeedUnit });
  }, [updateSettings]);

  const handleNotificationsToggle = useCallback((value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ notificationsEnabled: value });
  }, [updateSettings]);

  const handleSevereAlertsToggle = useCallback((value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ severeWeatherAlerts: value });
  }, [updateSettings]);

  const handleAbout = useCallback(() => {
    Alert.alert(
      'Climapro',
      'Version 1.0.0\n\nA premium weather application with dynamic themes, AI-powered insights, and beautiful visualizations.\n\nBuilt with React Native & Expo.',
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <GradientBackground style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.content, { paddingTop: insets.top + 16 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <AnimatedText variant="title" color="primary">
            Settings
          </AnimatedText>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Appearance */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <AnimatedText variant="subtitle" color="primary" style={styles.sectionTitle}>
              Appearance
            </AnimatedText>
            <GlassCard style={styles.sectionCard} padding={0} borderRadius={20}>
              <SettingItem
                icon="moon"
                title="Theme"
                subtitle="Choose app appearance"
                rightElement={
                  <SegmentedControl
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'system', label: 'Auto' },
                    ]}
                    selected={themeMode}
                    onSelect={handleThemeChange}
                  />
                }
              />
            </GlassCard>
          </Animated.View>

          {/* Units */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <AnimatedText variant="subtitle" color="primary" style={styles.sectionTitle}>
              Units
            </AnimatedText>
            <GlassCard style={styles.sectionCard} padding={0} borderRadius={20}>
              <View style={[styles.settingDivider, { borderBottomColor: theme.glassBorder }]}>
                <SettingItem
                  icon="thermometer"
                  title="Temperature"
                  subtitle="Choose temperature unit"
                  rightElement={
                    <SegmentedControl
                      options={[
                        { value: 'celsius', label: '°C' },
                        { value: 'fahrenheit', label: '°F' },
                      ]}
                      selected={settings.temperatureUnit}
                      onSelect={handleTemperatureUnitChange}
                    />
                  }
                />
              </View>
              <SettingItem
                icon="speedometer"
                title="Wind Speed"
                subtitle="Choose speed unit"
                rightElement={
                  <SegmentedControl
                    options={[
                      { value: 'kmh', label: 'km/h' },
                      { value: 'mph', label: 'mph' },
                    ]}
                    selected={settings.speedUnit}
                    onSelect={handleSpeedUnitChange}
                  />
                }
              />
            </GlassCard>
          </Animated.View>

          {/* Notifications */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <AnimatedText variant="subtitle" color="primary" style={styles.sectionTitle}>
              Notifications
            </AnimatedText>
            <GlassCard style={styles.sectionCard} padding={0} borderRadius={20}>
              <View style={[styles.settingDivider, { borderBottomColor: theme.glassBorder }]}>
                <SettingItem
                  icon="notifications"
                  title="Push Notifications"
                  subtitle="Receive weather updates"
                  rightElement={
                    <Switch
                      value={settings.notificationsEnabled}
                      onValueChange={handleNotificationsToggle}
                      trackColor={{ false: theme.glassBackground, true: theme.accent + '80' }}
                      thumbColor={settings.notificationsEnabled ? theme.accent : theme.textSecondary}
                    />
                  }
                />
              </View>
              <SettingItem
                icon="warning"
                title="Severe Weather Alerts"
                subtitle="Get notified of extreme weather"
                rightElement={
                  <Switch
                    value={settings.severeWeatherAlerts}
                    onValueChange={handleSevereAlertsToggle}
                    trackColor={{ false: theme.glassBackground, true: theme.accent + '80' }}
                    thumbColor={settings.severeWeatherAlerts ? theme.accent : theme.textSecondary}
                    disabled={!settings.notificationsEnabled}
                  />
                }
              />
            </GlassCard>
          </Animated.View>

          {/* About */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <AnimatedText variant="subtitle" color="primary" style={styles.sectionTitle}>
              About
            </AnimatedText>
            <GlassCard style={styles.sectionCard} padding={0} borderRadius={20}>
              <View style={[styles.settingDivider, { borderBottomColor: theme.glassBorder }]}>
                <SettingItem
                  icon="information-circle"
                  title="About Climapro"
                  subtitle="Version 1.0.0"
                  onPress={handleAbout}
                  rightElement={
                    <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                  }
                />
              </View>
              <SettingItem
                icon="star"
                title="Rate App"
                subtitle="Share your feedback"
                onPress={() => Alert.alert('Rate App', 'This would open the app store.')}
                rightElement={
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                }
              />
            </GlassCard>
          </Animated.View>

          {/* App Info */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(400)}
            style={styles.appInfo}
          >
            <AnimatedText variant="caption" color="secondary" style={styles.appInfoText}>
              Climapro
            </AnimatedText>
            <AnimatedText variant="caption" color="secondary" style={styles.appInfoText}>
              Premium Weather Experience
            </AnimatedText>
          </Animated.View>
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
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
    marginTop: 8,
  },
  sectionCard: {
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingDivider: {
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  segmentOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  segmentLabel: {
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  appInfoText: {
    opacity: 0.6,
  },
});
