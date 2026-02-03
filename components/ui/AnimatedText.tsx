import React, { useEffect } from 'react';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'hero';
  color?: 'primary' | 'secondary' | 'accent';
}

export function AnimatedText({
  children,
  style,
  variant = 'body',
  color = 'primary',
}: AnimatedTextProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.ease });
  }, [children, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const textColor = {
    primary: theme.textPrimary,
    secondary: theme.textSecondary,
    accent: theme.accent,
  }[color];

  const variantStyle = {
    hero: styles.hero,
    title: styles.title,
    subtitle: styles.subtitle,
    body: styles.body,
    caption: styles.caption,
  }[variant];

  return (
    <Animated.Text
      entering={FadeIn.duration(300)}
      style={[variantStyle, { color: textColor }, animatedStyle, style]}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  hero: {
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: -2,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
});
