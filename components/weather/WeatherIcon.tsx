import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherCondition } from '@/types/weather';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  animated?: boolean;
}

const conditionIcons: Record<WeatherCondition, keyof typeof Ionicons.glyphMap> = {
  clear: 'sunny',
  sunny: 'sunny',
  'partly-cloudy': 'partly-sunny',
  cloudy: 'cloudy',
  overcast: 'cloud',
  rain: 'rainy',
  'heavy-rain': 'thunderstorm',
  thunderstorm: 'flash',
  snow: 'snow',
  fog: 'cloud',
  mist: 'cloud',
  windy: 'flag',
  hail: 'snow',
};

const conditionColors: Record<WeatherCondition, string> = {
  clear: '#FFD700',
  sunny: '#FFD700',
  'partly-cloudy': '#FFE082',
  cloudy: '#90A4AE',
  overcast: '#78909C',
  rain: '#64B5F6',
  'heavy-rain': '#42A5F5',
  thunderstorm: '#FFC107',
  snow: '#E3F2FD',
  fog: '#B0BEC5',
  mist: '#CFD8DC',
  windy: '#81D4FA',
  hail: '#B0BEC5',
};

export function WeatherIcon({ condition, size = 80, animated = true }: WeatherIconProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      if (condition === 'sunny' || condition === 'clear') {
        // Pulsing effect for sun
        scale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        rotation.value = withRepeat(
          withTiming(360, { duration: 30000, easing: Easing.linear }),
          -1,
          false
        );
      } else if (condition === 'rain' || condition === 'heavy-rain') {
        // Subtle bounce for rain
        scale.value = withRepeat(
          withSequence(
            withTiming(0.95, { duration: 500 }),
            withTiming(1, { duration: 500 })
          ),
          -1,
          true
        );
      } else if (condition === 'thunderstorm') {
        // Flash effect for thunderstorm
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 100 }),
            withTiming(1, { duration: 100 }),
            withTiming(1, { duration: 2000 })
          ),
          -1,
          false
        );
      } else if (condition === 'windy') {
        // Sway effect for wind
        rotation.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }
    }
  }, [condition, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Ionicons
        name={conditionIcons[condition]}
        size={size}
        color={conditionColors[condition]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
