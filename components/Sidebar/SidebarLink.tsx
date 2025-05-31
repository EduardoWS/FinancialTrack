import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

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

  // Determina a cor de fundo com base nos estados
  const getBackgroundColor = () => {
    if (isActive) return 'bg-blue-100';
    if (isHovered) return 'bg-gray-100'; // Cor do hover!
    return 'bg-transparent';
  };
  
  // Determina a cor do texto com base nos estados
  const getTextColor = () => {
    if (isActive) return 'text-blue-600 font-bold';
    return 'text-gray-600';
  };

  // Determina a cor do ícone com base nos estados
  const getIconColor = () => {
    if (isActive) return '#2563EB';
    return '#4B5563';
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