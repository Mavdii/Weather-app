import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Rect, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 140;
const PADDING = 30;
const BAR_WIDTH = 28;

export function PrecipitationChart() {
  const { weatherData } = useWeather();
  const { theme } = useTheme();

  if (!weatherData?.daily) return null;

  const { daily } = weatherData;

  const data = daily.map((d) => ({
    day: d.dayName.substring(0, 3),
    probability: d.precipitationProbability,
  }));

  const barSpacing = (CHART_WIDTH - PADDING * 2) / data.length;
  const maxBarHeight = CHART_HEIGHT - PADDING * 2;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(800).duration(400)}>
        <AnimatedText variant="subtitle" color="primary" style={styles.title}>
          Precipitation Probability
        </AnimatedText>
      </Animated.View>
      <GlassCard style={styles.card} padding={16} borderRadius={20}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 30}>
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#64B5F6" stopOpacity="1" />
              <Stop offset="1" stopColor="#2196F3" stopOpacity="0.7" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value, i) => {
            const y = PADDING + maxBarHeight - (value / 100) * maxBarHeight;
            return (
              <React.Fragment key={`grid-${i}`}>
                <Line
                  x1={PADDING}
                  y1={y}
                  x2={CHART_WIDTH - PADDING}
                  y2={y}
                  stroke={theme.glassBorder}
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? '0' : '3,3'}
                />
                <SvgText
                  x={PADDING - 8}
                  y={y + 4}
                  fill={theme.textSecondary}
                  fontSize="10"
                  textAnchor="end"
                >
                  {value}%
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = (d.probability / 100) * maxBarHeight;
            const x = PADDING + i * barSpacing + (barSpacing - BAR_WIDTH) / 2;
            const y = PADDING + maxBarHeight - barHeight;

            return (
              <React.Fragment key={`bar-${i}`}>
                <Rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight || 2}
                  rx={4}
                  ry={4}
                  fill="url(#barGradient)"
                />
                <SvgText
                  x={x + BAR_WIDTH / 2}
                  y={CHART_HEIGHT + 20}
                  fill={theme.textSecondary}
                  fontSize="11"
                  textAnchor="middle"
                >
                  {d.day}
                </SvgText>
                {d.probability > 0 && (
                  <SvgText
                    x={x + BAR_WIDTH / 2}
                    y={y - 6}
                    fill={theme.textPrimary}
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {d.probability}%
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
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
    alignItems: 'center',
  },
});
