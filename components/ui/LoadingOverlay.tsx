import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedText } from './AnimatedText';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  const { theme, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.blur}>
        <View style={[styles.content, { backgroundColor: theme.glassBackground }]}>
          <ActivityIndicator size="large" color={theme.accent} />
          <AnimatedText variant="body" color="secondary" style={styles.message}>
            {message}
          </AnimatedText>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
  },
  message: {
    marginTop: 8,
  },
});
