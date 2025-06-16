import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

// Tipagem para as propriedades que o nosso link vai receber
type SidebarLinkProps = {
  link: {
    name: string;
    href: string;
    icon: string;
  };
  isActive: boolean;
};

const SidebarLink = ({ link, isActive }: SidebarLinkProps) => {
  // Estado para controlar se o mouse está sobre o componente
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Determina a cor de fundo com base nos estados
  const getBackgroundColor = () => {
    if (isActive) return isDark ? 'bg-blue-900/30' : 'bg-blue-500/10';
    if (isHovered) return isDark ? 'bg-gray-700' : 'bg-gray-100';
    return 'bg-transparent';
  };
  
  // Determina a cor do texto com base nos estados
  const getTextColor = () => {
    if (isActive) return 'text-blue-600 font-bold';
    return isDark ? 'text-gray-300' : 'text-gray-600';
  };

  // Determina a cor do ícone com base nos estados
  const getIconColor = () => {
    if (isActive) return '#2563EB';
    return isDark ? '#D1D5DB' : '#4B5563';
  };

  return (
    <Link href={link.href as any} asChild>
      <Pressable
        // Eventos que controlam o estado de hover
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <View className={`p-3 rounded-lg mb-2 flex-row items-center ${getBackgroundColor()}`}>
          <FontAwesome
            name={link.icon as any}
            size={18}
            color={getIconColor()}
          />
          <Text className={`text-lg ml-3 ${getTextColor()}`}>
            {link.name}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default SidebarLink;