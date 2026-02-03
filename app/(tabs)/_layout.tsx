import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}

function TabIcon({ name, color, focused }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: theme.glassBackground,
                  borderTopWidth: 1,
                  borderTopColor: theme.glassBorder,
                },
              ]}
            />
          </BlurView>
        ),
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: -2,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'partly-sunny' : 'partly-sunny-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'search' : 'search-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'map' : 'map-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'heart' : 'heart-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'settings' : 'settings-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    transform: [{ scale: 1.05 }],
  },
});
