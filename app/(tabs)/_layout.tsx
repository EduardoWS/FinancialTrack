import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Sidebar from '../../components/Sidebar';
import { BottomNavigation } from '../../components/atoms/BottomNavigation';
import { useScreenSize } from '../../hooks/useScreenSize';

export default function AppLayout() {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    // Layout Mobile com Bottom Navigation
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-gray-100">
          {/* Conteúdo principal */}
          <View className="flex-1">
            <Slot />
          </View>
          
          {/* Bottom Navigation */}
          <BottomNavigation />
        </View>
      </SafeAreaProvider>
    );
  }

  // Layout Desktop com Sidebar
  return (
    <SafeAreaProvider>
      <View className="flex-1 flex-row bg-gray-100">
        {/* Sidebar para desktop */}
        <Sidebar />

        {/* Conteúdo principal */}
        <View className="flex-1">
          <Slot />
        </View>
      </View>
    </SafeAreaProvider>
  );
}