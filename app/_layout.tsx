import { Stack } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Detail Pages */}
        <Stack.Screen name="details/agent" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="details/tournament" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="details/weapon" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="details/bundle" options={{ headerShown: false, presentation: 'card' }} />
        {/* NEW: Detail Skin */}
        <Stack.Screen name="details/skin" options={{ headerShown: false, presentation: 'card' }} />
        
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}