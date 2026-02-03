import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search cities...',
  isLoading = false,
  onFocus,
  onBlur,
}: SearchInputProps) {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused ? theme.accent : theme.glassBorder,
          backgroundColor: theme.glassBackground,
        },
      ]}
    >
      <BlurView
        intensity={25}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blur}
      >
        <View style={styles.content}>
          <Ionicons
            name="search"
            size={20}
            color={theme.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.textPrimary }]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.accent} style={styles.clearButton} />
          ) : value.length > 0 ? (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  clearButton: {
    marginLeft: 10,
    padding: 4,
  },
});
