import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function GradientBackground({ children, style }: GradientBackgroundProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={theme.gradientColors as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
