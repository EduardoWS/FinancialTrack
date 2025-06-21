import { useScreenSize } from '@/hooks/useScreenSize';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import { ThemeSwitch } from './ThemeSwitch';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOption {
  mode: ThemeMode;
  label: string;
  description: string;
}

export function ThemeToggle() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useScreenSize();

  const isDark = theme === 'dark';

  // Versão mobile: renderiza somente um switch sem menu adicional
  if (isMobile) {
    return (
      <View className="flex-row items-center space-x-2">
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={18}
          color={isDark ? '#D1D5DB' : '#6B7280'}
        />
        <ThemeSwitch />
      </View>
    );
  }

  const themeOptions: ThemeOption[] = [
    {
      mode: 'light',
      label: 'Claro',
      description: 'Tema claro sempre ativo'
    },
    {
      mode: 'dark',
      label: 'Escuro',
      description: 'Tema escuro sempre ativo'
    },
    {
      mode: 'system',
      label: 'Sistema',
      description: 'Segue o tema do sistema'
    }
  ];

  // Ícone do botão baseado no tema atual (não no modo)
  const getCurrentIcon = (): keyof typeof Ionicons.glyphMap => {
    return theme === 'dark' ? 'moon' : 'sunny';
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setIsMenuOpen(false);
  };

  return (
    <View className="relative">
      {/* Botão do tema */}
      <TouchableOpacity
        onPress={() => setIsMenuOpen(!isMenuOpen)}
        className={`p-2 rounded-full ${
          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
      >
        <Ionicons 
          name={getCurrentIcon()} 
          size={20} 
          color={isDark ? '#D1D5DB' : '#6B7280'} 
        />
      </TouchableOpacity>

      {/* Modal do menu dropdown */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/20"
          onPress={() => setIsMenuOpen(false)}
        >
          <View className={`absolute top-16 right-4 rounded-lg shadow-lg py-2 min-w-56 border ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Título */}
            <View className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <Text className={`font-semibold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Escolher Tema
              </Text>
            </View>

            {/* Opções de tema */}
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.mode}
                onPress={() => handleThemeChange(option.mode)}
                className={`flex-row items-center px-4 py-3 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } ${themeMode === option.mode ? (isDark ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
              >
                <View className="flex-1">
                  <Text className={`font-medium ${
                    themeMode === option.mode 
                      ? 'text-blue-600' 
                      : (isDark ? 'text-white' : 'text-gray-800')
                  }`}>
                    {option.label}
                  </Text>
                  <Text className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </Text>
                </View>
                
                {themeMode === option.mode && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#3B82F6"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
} 