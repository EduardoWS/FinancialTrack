import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router'; // Importe o Slot!
import Sidebar from '../../components/Sidebar'; // Vamos criar este componente

export default function AppLayout() {
  return (
    // Contêiner principal com flexbox para alinhar lado a lado
    <View className="flex-1 flex-row bg-gray-100">
      {/* Nossa barra lateral */}
      <Sidebar />

      {/* Contêiner para o conteúdo principal */}
      <View className="flex-1">
        {/* O Slot renderizará a página ativa aqui (dashboard.tsx, etc.) */}
        <Slot />
      </View>
    </View>
  );
}