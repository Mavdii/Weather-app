import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: boolean;
}

export function IconButton({
  name,
  onPress,
  size = 24,
  color,
  style,
  disabled = false,
  haptic = true,
}: IconButtonProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: theme.glassBackground,
          borderColor: theme.glassBorder,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons name={name} size={size} color={color || theme.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
