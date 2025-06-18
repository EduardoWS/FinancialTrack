import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../services/ThemeContext';

type NavItem = {
  name: string;
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'home', label: 'Dashboard' },
  { name: 'Transações', href: '/transacoes', icon: 'swap-horizontal', label: 'Transações' },
  { name: 'Categorias', href: '/categorias', icon: 'pricetags', label: 'Categorias' },
  { name: 'Metas', href: '/metas', icon: 'rocket', label: 'Metas' },
  { name: 'Relatórios', href: '/relatorios', icon: 'bar-chart', label: 'Relatórios' },
];

export const BottomNavigation = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  const handleNavigation = (href: string) => {
    router.push(href as any);
  };

  return (
    <View 
      className={`flex-row justify-around items-center py-2 border-t ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`} 
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => handleNavigation(item.href)}
            className="items-center justify-center px-2 py-1 min-w-[60px]"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.icon : `${item.icon}-outline` as any}
              size={24}
              color={
                isActive 
                  ? '#3B82F6' 
                  : isDark 
                    ? '#9CA3AF' 
                    : '#6B7280'
              }
            />
            <Text 
              className={`text-xs mt-1 font-medium ${
                isActive 
                  ? 'text-blue-600' 
                  : isDark 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
              }`}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}; 