import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

/**
 * ThemeSwitch
 * Switch customizado que alterna entre tema claro e escuro.
 * Funciona perfeitamente tanto no web quanto no mobile nativo.
 */
export function ThemeSwitch() {
  const { theme, setThemeMode } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    // Alterna entre claro e escuro. Mantemos somente estes dois modos no mobile
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity
      style={{
        width: 55,
        height: 28,
        borderRadius: 14,
        backgroundColor: isDark ? '#555555' : '#555555',
        padding: 2,
        justifyContent: 'center',
        position: 'relative',
      }}
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      {/* Ícone do Sol - lado esquerdo */}
      <View
        style={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: [{ translateY: -6 }],
        }}
      >
        <Ionicons
          name="sunny"
          size={14}
          color={isDark ? '#ffffff' : '#ffffff'} // if dark, blue
        />
      </View>

      {/* Ícone da Lua - lado direito */}
      <View
        style={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: [{ translateY: -6 }],
        }}
      >
        <Ionicons
          name="moon"
          size={14}
          color={isDark ? '#ffffff' : '#ffffff'}
        />
      </View>

      {/* Bolinha deslizante */}
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 12,
          backgroundColor: '#ffffff',
          transform: [{ translateX: isDark ? 26 : 0 }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
          zIndex: 1,
        }}
      />
    </TouchableOpacity>
  );
} 