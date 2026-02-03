import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 120;
const PADDING = 30;

export function TemperatureChart() {
  const { weatherData, formatTemperature, settings } = useWeather();
  const { theme } = useTheme();

  if (!weatherData?.daily) return null;

  const { daily } = weatherData;

  // Get temperature data
  const temps = daily.map((d) => ({
    high: d.high,
    low: d.low,
    day: d.dayName.substring(0, 3),
  }));

  // Calculate scales
  const allTemps = temps.flatMap((t) => [t.high, t.low]);
  const minTemp = Math.min(...allTemps) - 3;
  const maxTemp = Math.max(...allTemps) + 3;
  const tempRange = maxTemp - minTemp;

  const xScale = (index: number) => PADDING + (index * (CHART_WIDTH - PADDING * 2)) / (temps.length - 1);
  const yScale = (temp: number) => CHART_HEIGHT - PADDING - ((temp - minTemp) / tempRange) * (CHART_HEIGHT - PADDING * 2);

  // Generate path for high temps
  const highPath = temps.reduce((path, t, i) => {
    const x = xScale(i);
    const y = yScale(t.high);
    return path + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }, '');

  // Generate path for low temps
  const lowPath = temps.reduce((path, t, i) => {
    const x = xScale(i);
    const y = yScale(t.low);
    return path + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }, '');

  // Generate fill area between lines
  const fillPath = temps.reduce((path, t, i) => {
    const x = xScale(i);
    const yHigh = yScale(t.high);
    const yLow = yScale(t.low);
    if (i === 0) return `M ${x} ${yHigh}`;
    return path + ` L ${x} ${yHigh}`;
  }, '') + temps.reduceRight((path, t, i) => {
    const x = xScale(i);
    const yLow = yScale(t.low);
    return path + ` L ${x} ${yLow}`;
  }, '') + ' Z';

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(700).duration(400)}>
        <AnimatedText variant="subtitle" color="primary" style={styles.title}>
          Temperature Trend
        </AnimatedText>
      </Animated.View>
      <GlassCard style={styles.card} padding={16} borderRadius={20}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
            <AnimatedText variant="caption" color="secondary">
              High
            </AnimatedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.textSecondary }]} />
            <AnimatedText variant="caption" color="secondary">
              Low
            </AnimatedText>
          </View>
        </View>

        <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 30}>
          <Defs>
            <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.accent} stopOpacity="0.3" />
              <Stop offset="1" stopColor={theme.accent} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 1, 2, 3].map((i) => {
            const y = PADDING + (i * (CHART_HEIGHT - PADDING * 2)) / 3;
            return (
              <Line
                key={`grid-${i}`}
                x1={PADDING}
                y1={y}
                x2={CHART_WIDTH - PADDING}
                y2={y}
                stroke={theme.glassBorder}
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            );
          })}

          {/* Fill area */}
          <Path d={fillPath} fill="url(#fillGradient)" />

          {/* High temp line */}
          <Path
            d={highPath}
            stroke={theme.accent}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Low temp line */}
          <Path
            d={lowPath}
            stroke={theme.textSecondary}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6,3"
          />

          {/* Data points */}
          {temps.map((t, i) => (
            <React.Fragment key={`points-${i}`}>
              <Circle
                cx={xScale(i)}
                cy={yScale(t.high)}
                r={4}
                fill={theme.accent}
              />
              <Circle
                cx={xScale(i)}
                cy={yScale(t.low)}
                r={3}
                fill={theme.textSecondary}
              />
            </React.Fragment>
          ))}

          {/* Day labels */}
          {temps.map((t, i) => (
            <SvgText
              key={`label-${i}`}
              x={xScale(i)}
              y={CHART_HEIGHT + 20}
              fill={theme.textSecondary}
              fontSize="11"
              textAnchor="middle"
            >
              {t.day}
            </SvgText>
          ))}
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
  legend: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
