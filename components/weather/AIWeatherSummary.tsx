import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTextGeneration } from '@fastshot/ai';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { useWeather } from '@/contexts/WeatherContext';
import { useTheme } from '@/contexts/ThemeContext';
import { WeatherData } from '@/types/weather';

interface AIWeatherSummaryProps {
  weatherData: WeatherData | null;
}

export function AIWeatherSummary({ weatherData }: AIWeatherSummaryProps) {
  const { theme } = useTheme();
  const { settings } = useWeather();
  const [lastGeneratedFor, setLastGeneratedFor] = useState<string | null>(null);

  const { generateText, data, isLoading, error } = useTextGeneration({
    onSuccess: () => {
      if (weatherData) {
        setLastGeneratedFor(weatherData.location.id);
      }
    },
  });

  const generateSummary = useCallback(async () => {
    if (!weatherData) return;

    const { current, location, hourly } = weatherData;
    const unit = settings.temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit';

    // Check if rain is expected in the next few hours
    const rainExpected = hourly.slice(0, 12).some(h =>
      h.condition === 'rain' || h.condition === 'heavy-rain' || h.condition === 'thunderstorm'
    );

    const prompt = `You are a friendly weather assistant. Generate a brief, conversational weather summary (2-3 sentences max) for ${location.name}, ${location.country}.

Current conditions:
- Temperature: ${current.temperature}°${unit === 'Celsius' ? 'C' : 'F'} (feels like ${current.feelsLike}°)
- Condition: ${current.description}
- Humidity: ${current.humidity}%
- UV Index: ${current.uvIndex}
- Wind: ${current.windSpeed} km/h ${current.windDirection}
- High/Low today: ${current.high}°/${current.low}°
${rainExpected ? '- Rain expected in the next 12 hours' : ''}

Be friendly and give practical advice (like whether to bring an umbrella, wear sunscreen, or enjoy outdoor activities). Keep it conversational and helpful. Don't use bullet points or lists - write naturally.`;

    await generateText(prompt);
  }, [weatherData, settings.temperatureUnit, generateText]);

  // Auto-generate summary when weather data changes
  useEffect(() => {
    if (weatherData && weatherData.location.id !== lastGeneratedFor && !isLoading) {
      generateSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData?.location.id]);

  if (!weatherData) return null;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(150).duration(400)}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="sparkles" size={20} color={theme.accent} />
            <AnimatedText variant="subtitle" color="primary" style={styles.title}>
              AI Weather Insight
            </AnimatedText>
          </View>
          <TouchableOpacity
            onPress={generateSummary}
            disabled={isLoading}
            style={[
              styles.refreshButton,
              { backgroundColor: theme.glassBackground, borderColor: theme.glassBorder },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <Ionicons name="refresh" size={18} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(400)}>
        <GlassCard style={styles.card} padding={20} borderRadius={20}>
          {isLoading && !data ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.accent} />
              <AnimatedText variant="body" color="secondary" style={styles.loadingText}>
                Analyzing weather conditions...
              </AnimatedText>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={theme.textSecondary} />
              <AnimatedText variant="body" color="secondary" style={styles.summaryText}>
                Unable to generate summary. Tap refresh to try again.
              </AnimatedText>
            </View>
          ) : data ? (
            <View style={styles.summaryContainer}>
              <AnimatedText variant="body" color="primary" style={styles.summaryText}>
                {data}
              </AnimatedText>
            </View>
          ) : (
            <AnimatedText variant="body" color="secondary" style={styles.summaryText}>
              Tap refresh to get an AI-powered weather summary.
            </AnimatedText>
          )}
        </GlassCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    marginLeft: 4,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  card: {},
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryContainer: {},
  summaryText: {
    lineHeight: 24,
  },
});
