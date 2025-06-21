import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';
import { useTheme } from '../../services/ThemeContext';
import { successToast } from './custom-toasts';
import { useScreenSize } from '../../hooks/useScreenSize';

export function UserMenu() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isMobile } = useScreenSize();
  // MOBILE ► Renderização inline dentro do menu hambúrguer
  if (isMobile) {
    const handleLogoutMobile = async () => {
      await logout();
      successToast('Logout realizado com sucesso!');
      router.replace('/login');
    };

    const menuItemsMobile = [
      {
        icon: 'person-outline',
        label: 'Perfil',
        onPress: () => {
          // TODO: Navegar para perfil
        }
      },
      {
        icon: 'settings-outline',
        label: 'Configurações',
        onPress: () => {
          // TODO: Navegar para configurações
        }
      },
      {
        icon: 'help-circle-outline',
        label: 'Ajuda',
        onPress: () => {
          // TODO: Navegar para ajuda
        }
      },
      {
        icon: 'log-out-outline',
        label: 'Sair',
        onPress: handleLogoutMobile,
        isDestructive: true
      }
    ];

    return (
      <View className="">
        {/* Informações do usuário */}
        <View className="mb-4">
          <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.nome}</Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</Text>
        </View>

        {/* Itens do menu */}
        {menuItemsMobile.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className={`flex-row items-center py-2 ${
              item.isDestructive
                ? isDark
                  ? 'active:bg-red-900/20'
                  : 'active:bg-red-50'
                : isDark
                  ? 'active:bg-gray-700'
                  : 'active:bg-gray-100'
            } rounded-lg px-2`}
          >
            <Ionicons
              name={item.icon as any}
              size={18}
              color={item.isDestructive ? '#EF4444' : isDark ? '#D1D5DB' : '#6B7280'}
              style={{ marginRight: 12 }}
            />
            <Text
              className={`text-sm ${
                item.isDestructive ? 'text-red-600' : isDark ? 'text-white' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // WEB ► Mantém o comportamento original com modal dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    successToast('Logout realizado com sucesso!');
    router.replace('/login');
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Perfil',
      onPress: () => {
        setIsMenuOpen(false);
        // TODO: Navegar para perfil
      }
    },
    {
      icon: 'settings-outline',
      label: 'Configurações',
      onPress: () => {
        setIsMenuOpen(false);
        // TODO: Navegar para configurações
      }
    },
    {
      icon: 'help-circle-outline',
      label: 'Ajuda',
      onPress: () => {
        setIsMenuOpen(false);
        // TODO: Navegar para ajuda
      }
    },
    {
      icon: 'log-out-outline',
      label: 'Sair',
      onPress: handleLogout,
      isDestructive: true
    }
  ];

  return (
    <View className="relative">
      {/* Avatar do usuário */}
      <TouchableOpacity
        onPress={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center"
      >
        {user?.nome ? (
          <Text className="text-white font-semibold text-sm">
            {user.nome.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <Ionicons name="person" size={20} color="white" />
        )}
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
          <View className={`absolute top-16 right-4 rounded-lg shadow-lg py-2 min-w-48 border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Informações do usuário */}
            <View className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>
                {user?.nome}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} numberOfLines={1}>
                {user?.email}
              </Text>
            </View>

            {/* Itens do menu */}
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className={`flex-row items-center px-4 py-3 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                } ${
                  item.isDestructive
                    ? isDark
                      ? 'hover:bg-red-900/20'
                      : 'hover:bg-red-50'
                    : ''
                }`}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.isDestructive ? '#EF4444' : isDark ? '#D1D5DB' : '#6B7280'}
                  style={{ marginRight: 12 }}
                />
                <Text className={`text-sm ${item.isDestructive ? 'text-red-600' : isDark ? 'text-white' : 'text-gray-700'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
} 