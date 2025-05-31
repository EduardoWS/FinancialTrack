import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../../components/Header'; // Importando o Header

const DashboardScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Dashboard" />
      <View className="p-4">
        <Text className="text-xl text-gray-800">Bem-vindo ao seu Dashboard!</Text>
        {/* Adicione aqui os outros componentes (gráficos, etc.) */}
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;