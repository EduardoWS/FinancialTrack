import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Header from '../../components/Header';
import { useTheme } from '../../services/ThemeContext';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Dashboard" />
      
      <View className="p-4">
        <Text className={`text-xl mb-4 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          Bem-vindo ao seu Dashboard!
        </Text>
        
        {/* Placeholder para conteúdo futuro */}
        <View className={`rounded-lg p-4 shadow-sm ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Aqui ficarão os gráficos e informações financeiras
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;