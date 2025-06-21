import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

/**
 * ThemeSwitch
 * Switch nativo estilizado que alterna entre tema claro e escuro no mobile.
 * O componente não altera o estado do modal pai – apenas troca o tema.
 */
export function ThemeSwitch() {
  const { theme, setThemeMode } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    // Alterna entre claro e escuro. Mantemos somente estes dois modos no mobile
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <Switch
      value={isDark}
      onValueChange={toggleTheme}
      // Cores de acordo com a paleta Tailwind (slate/blue)
      trackColor={{ false: '#94a3b8', true: '#60a5fa' }}
      thumbColor={isDark ? '#0f172a' : '#f1f5f9'}
      ios_backgroundColor="#94a3b8"
    />
  );
} 