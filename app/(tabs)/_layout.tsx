import { COLORS, FONTS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 2,
          borderTopColor: COLORS.primary,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.semiBold,
          fontSize: 9, // Sedikit diperkecil agar muat 5 tab
          marginBottom: insets.bottom > 0 ? 0 : 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'AGENTS',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "account-group" : "account-group-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="arsenal"
        options={{
          title: 'ARSENAL',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "pistol" : "pistol"} size={24} color={color} />
          ),
        }}
      />

      {/* NEW TAB: BUNDLES */}
      <Tabs.Screen
        name="bundles"
        options={{
          title: 'BUNDLES',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "bag-personal" : "bag-personal-outline"} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="esports"
        options={{
          title: 'ESPORTS',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "trophy" : "trophy-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'MAP',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "map-marker-radius" : "map-marker-radius-outline"} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen name="explore" options={{ href: null }} /> 
    </Tabs>
  );
}