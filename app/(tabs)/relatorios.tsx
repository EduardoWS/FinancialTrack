import React from "react";
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../../components/Header'; // Importando o Header

const RelatoriosScreen = () => {
    return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="Relatórios" />
      <View className="p-4">
        <Text className="text-xl text-gray-800">Bem-vindo à tela Relatorios</Text>
        {/* Adicione aqui os outros componentes */}
      </View>
    </SafeAreaView>
    );
}
export default RelatoriosScreen;