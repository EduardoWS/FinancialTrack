import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <View className="h-16 bg-white flex-row items-center justify-between px-4 border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      
      <View className="flex-row items-center space-x-4">
        {/* Barra de Busca e outros ícones */}
        <TextInput placeholder="Buscar..." className="hidden md:block bg-gray-100 rounded-lg px-3 py-1"/>
        <FontAwesome name="cog" size={24} color="gray" />
        <FontAwesome name="bell" size={24} color="gray" />
        {/* Avatar do usuário */}
      </View>
    </View>
  );
};

export default Header;