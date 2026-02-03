import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const ARC_WIDTH = CARD_WIDTH - 40;
const ARC_HEIGHT = 80;

export function SunriseSunsetSection() {
  const { weatherData } = useWeather();
  const { theme } = useTheme();

  if (!weatherData?.sun) return null;

  const { sun } = weatherData;

  // Calculate sun position on the arc
  const sunPosition = sun.currentPosition;
  const isNight = sunPosition <= 0 || sunPosition >= 1;

  // Calculate SVG path for arc
  const startX = 20;
  const endX = ARC_WIDTH - 20;
  const midX = ARC_WIDTH / 2;
  const controlY = -ARC_HEIGHT + 20;

  // Calculate sun position on the arc using quadratic bezier formula
  const t = Math.max(0, Math.min(1, sunPosition));
  const sunX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
  const sunY = (1 - t) * (1 - t) * ARC_HEIGHT + 2 * (1 - t) * t * controlY + t * t * ARC_HEIGHT;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(600).duration(400)}>
        <AnimatedText variant="subtitle" color="primary" style={styles.title}>
          Sunrise & Sunset
        </AnimatedText>
      </Animated.View>
      <GlassCard style={styles.card} padding={20} borderRadius={20}>
        <View style={styles.arcContainer}>
          <Svg width={ARC_WIDTH} height={ARC_HEIGHT + 40} style={styles.svg}>
            <Defs>
              <LinearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={theme.textSecondary} stopOpacity="0.3" />
                <Stop offset="0.5" stopColor={theme.accent} stopOpacity="0.5" />
                <Stop offset="1" stopColor={theme.textSecondary} stopOpacity="0.3" />
              </LinearGradient>
            </Defs>

            {/* Horizon line */}
            <Path
              d={`M ${startX} ${ARC_HEIGHT + 20} L ${endX} ${ARC_HEIGHT + 20}`}
              stroke={theme.glassBorder}
              strokeWidth="1"
              strokeDasharray="5,5"
            />

            {/* Arc path */}
            <Path
              d={`M ${startX} ${ARC_HEIGHT + 20} Q ${midX} ${controlY + 20} ${endX} ${ARC_HEIGHT + 20}`}
              stroke="url(#arcGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Sun circle */}
            {!isNight && (
              <Circle
                cx={sunX}
                cy={sunY + 20}
                r={14}
                fill={theme.accent}
              />
            )}
          </Svg>
        </View>

        <View style={styles.timesContainer}>
          <View style={styles.timeItem}>
            <Ionicons name="sunny-outline" size={24} color={theme.accent} />
            <AnimatedText variant="caption" color="secondary">
              Sunrise
            </AnimatedText>
            <AnimatedText variant="body" color="primary" style={styles.timeValue}>
              {sun.sunrise}
            </AnimatedText>
          </View>

          <View style={styles.timeItem}>
            <Ionicons name="moon-outline" size={24} color={theme.textSecondary} />
            <AnimatedText variant="caption" color="secondary">
              Sunset
            </AnimatedText>
            <AnimatedText variant="body" color="primary" style={styles.timeValue}>
              {sun.sunset}
            </AnimatedText>
          </View>
        </View>
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
  card: {},
  arcContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  svg: {
    marginTop: 10,
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    alignItems: 'center',
    gap: 4,
  },
  timeValue: {
    fontWeight: '600',
  },
});
