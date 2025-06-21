import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../services/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

type MobileHeaderProps = {
  title: string;
};

export const MobileHeader = ({ title }: MobileHeaderProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <View 
        className={`flex-row items-center justify-between px-4 border-b ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        style={{ 
          paddingTop: Math.max(insets.top, 8),
          height: 56 + Math.max(insets.top, 8)
        }}
      >
        {/* Logo/Título */}
        <Text className={`text-lg font-bold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </Text>
        
        {/* Ações do Header */}
        <View className="flex-row items-center">
          {/* Notificações */}
          <TouchableOpacity 
            className={`p-2 rounded-full mr-2 ${
              isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'
            }`}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="notifications-outline" 
              size={20} 
              color={isDark ? '#D1D5DB' : '#6B7280'} 
            />
            {/* Badge de notificação */}
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></View>
          </TouchableOpacity>
          
          {/* Menu hambúrguer */}
          <TouchableOpacity 
            onPress={() => setShowMenu(true)}
            className={`p-2 rounded-full ${
              isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'
            }`}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="menu" 
              size={20} 
              color={isDark ? '#D1D5DB' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal do Menu */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        {/* Overlay que fecha o menu */}
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowMenu(false)}
        >
          {/* Container do menu – absorve o clique para não fechar */}
          <Pressable
            onPress={() => { /* impede propagação */ }}
            className={`absolute right-2  min-w-[200px] rounded-lg border shadow-lg ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
            style={{ top: 12 + Math.max(insets.top, 8) + 8 }}
          >
            <View className="p-4">
              <View className="mb-4">
                {/* Toggle de Tema */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Tema</Text>
                  <ThemeToggle />
                </View>

                {/* Divisor */}
                <View className={`h-px mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                {/* Menu do usuário */}
                <UserMenu />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}; 