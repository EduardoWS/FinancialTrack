import { usePathname } from 'expo-router'; // Importe o usePathname
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import SidebarLink from './SidebarLink'; // Importe o novo componente

// Definindo os links em um array para ficar mais organizado
const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: 'home' },
  { name: 'Transações', href: '/transacoes', icon: 'exchange' },
  { name: 'Categorias', href: '/categorias', icon: 'tags' },
  { name: 'Metas', href: '/metas', icon: 'bullseye' },
  { name: 'Relatórios', href: '/relatorios', icon: 'bar-chart' },
];

const Sidebar = () => {
  const pathname = usePathname(); // Hook que nos dá a URL exata
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`w-64 h-full p-5 border-r ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <Text className="text-2xl font-bold text-blue-600 mb-10">Financial Track</Text>
      
      {sidebarLinks.map((link) => (
        <SidebarLink 
          key={link.name}
          link={link}
          // Passamos para o filho se ele está ativo ou não
          isActive={pathname === link.href}
        />
      ))}
    </View>
  );
};

export default Sidebar;