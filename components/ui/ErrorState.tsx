import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { AnimatedText } from './AnimatedText';
import { useTheme } from '@/contexts/ThemeContext';

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  icon = 'cloud-offline',
  onRetry,
}: ErrorStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.content}>
          <Ionicons name={icon} size={64} color={theme.textSecondary} />
          <AnimatedText variant="title" color="primary" style={styles.title}>
            {title}
          </AnimatedText>
          <AnimatedText variant="body" color="secondary" style={styles.message}>
            {message}
          </AnimatedText>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={[styles.retryButton, { backgroundColor: theme.accent }]}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <AnimatedText
                variant="body"
                style={[styles.retryText, { color: '#FFFFFF' }]}
              >
                Try Again
              </AnimatedText>
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 320,
  },
  content: {
    alignItems: 'center',
    padding: 8,
    gap: 12,
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 8,
    gap: 8,
  },
  retryText: {
    fontWeight: '600',
  },
});
