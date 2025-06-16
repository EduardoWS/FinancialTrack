import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { UserMenu } from '../atoms/UserMenu';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`h-16 flex-row items-center justify-between px-6 border-b shadow-sm ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <Text className={`text-2xl font-bold ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        {title}
      </Text>
      
      <View className="flex-row items-center space-x-4">
        {/* Barra de Busca */}
        <View className="relative">
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Ionicons name="search" size={16} color="#9CA3AF" />
          </View>
          <TextInput
            placeholder="Buscar..."
            className={`rounded-full pl-10 pr-4 py-2 text-sm w-64 ${
              isDark 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        {/* Ícones de tema, notificação e menu usuário */}
        <View className="flex-row items-center space-x-3">
          {/* Toggle de Tema */}
          <ThemeToggle />
          
          {/* Notificações */}
          <View className={`p-2 rounded-full relative ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}>
            <Ionicons 
              name="notifications-outline" 
              size={20} 
              color={isDark ? '#D1D5DB' : '#6B7280'} 
            />
            {/* Badge de notificação */}
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></View>
          </View>
          
          {/* Menu do usuário */}
          <UserMenu />
        </View>
      </View>
    </View>
  );
};

export default Header;