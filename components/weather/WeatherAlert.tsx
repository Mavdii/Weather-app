import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { WeatherAlert as WeatherAlertType } from '@/types/weather';

interface WeatherAlertCardProps {
  alert: WeatherAlertType;
  onDismiss?: () => void;
}

function WeatherAlertCard({ alert, onDismiss }: WeatherAlertCardProps) {
  const { theme } = useTheme();

  const severityColors = {
    minor: '#4CAF50',
    moderate: '#FF9800',
    severe: '#F44336',
    extreme: '#9C27B0',
  };

  const severityIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    minor: 'information-circle',
    moderate: 'warning',
    severe: 'alert-circle',
    extreme: 'nuclear',
  };

  const alertColor = severityColors[alert.severity];

  return (
    <GlassCard
      style={[styles.alertCard, { borderLeftWidth: 4, borderLeftColor: alertColor }]}
      padding={16}
      borderRadius={16}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleRow}>
          <Ionicons
            name={severityIcons[alert.severity]}
            size={22}
            color={alertColor}
          />
          <View style={styles.alertTitleContainer}>
            <AnimatedText variant="body" color="primary" style={styles.alertTitle}>
              {alert.title}
            </AnimatedText>
            <AnimatedText variant="caption" color="secondary">
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </AnimatedText>
          </View>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Ionicons name="close" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <AnimatedText variant="caption" color="secondary" style={styles.alertDescription}>
        {alert.description}
      </AnimatedText>
    </GlassCard>
  );
}

export function WeatherAlertSection() {
  const { weatherData } = useWeather();
  const { theme } = useTheme();

  if (!weatherData?.alerts || weatherData.alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(50).duration(400)}>
        <View style={styles.header}>
          <Ionicons name="warning" size={20} color="#FF9800" />
          <AnimatedText variant="subtitle" color="primary" style={styles.title}>
            Weather Alerts
          </AnimatedText>
        </View>
      </Animated.View>
      {weatherData.alerts.map((alert, index) => (
        <Animated.View
          key={alert.id}
          entering={FadeInUp.delay(100 + index * 50).duration(400)}
        >
          <WeatherAlertCard alert={alert} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  title: {
    marginLeft: 4,
  },
  alertCard: {
    marginBottom: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  dismissButton: {
    padding: 4,
  },
  alertDescription: {
    lineHeight: 18,
    marginLeft: 34,
  },
});
