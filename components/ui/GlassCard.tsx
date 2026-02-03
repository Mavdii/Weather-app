import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: number;
  borderRadius?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 30,
  padding = 16,
  borderRadius = 20,
}: GlassCardProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderColor: theme.glassBorder,
          backgroundColor: theme.glassBackground,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.blur, { borderRadius, padding }]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    width: '100%',
    height: '100%',
  },
});
