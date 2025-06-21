import { Stack } from 'expo-router';
import React from 'react';
import { ForceThemeProvider } from '../../services/ThemeContext';

export default function AuthLayout() {
  return (
    <ForceThemeProvider forceTheme="light">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
      </Stack>
    </ForceThemeProvider>
  );
}
