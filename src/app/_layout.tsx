import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { COLORS } from '../constants/theme';
import LoadingScreen from '../components/LoadingScreen';
import OnboardingScreen from './onboarding';

// Prevent the native splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });

  const [minSplashElapsed, setMinSplashElapsed] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    // Keep the loading screen visible for 9 seconds so users see the cheetah loading screen
    const timer = setTimeout(() => {
      setMinSplashElapsed(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  const isReady = fontsLoaded && minSplashElapsed;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  // Pop up the history journey onboarding screen immediately after loading!
  if (!hasOnboarded) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onContinue={() => setHasOnboarded(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="loading"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="culture"
          options={{
            headerShown: false,
            title: 'Culture',
          }}
        />
        <Stack.Screen
          name="states"
          options={{
            headerShown: false,
            title: 'States & Territories',
          }}
        />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
