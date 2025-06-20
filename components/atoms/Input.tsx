import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
}

export function Input({ 
  label, 
  error, 
  icon, 
  isPassword = false,
  size = 'medium',
  variant = 'default',
  style,
  ...props 
}: InputProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2';
      case 'large':
        return 'px-5 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getVariantClasses = () => {
    if (error) {
      return 'border-red-500 bg-red-50';
    }

    switch (variant) {
      case 'outlined':
        return `border-2 ${isFocused 
          ? 'border-blue-500' 
          : (isDark ? 'border-gray-600' : 'border-gray-300')
        } ${isDark ? 'bg-transparent' : 'bg-transparent'}`;
      case 'filled':
        return `border ${isFocused 
          ? 'border-blue-500' 
          : (isDark ? 'border-gray-600' : 'border-gray-300')
        } ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`;
      default:
        return `border ${isFocused 
          ? 'border-blue-500' 
          : (isDark ? 'border-gray-600' : 'border-gray-300')
        } ${isDark ? 'bg-gray-800' : 'bg-white'}`;
    }
  };

  // Style para remover outline em plataformas web
  const inputStyle = [
    style,
    Platform.OS === 'web' && {
      outline: 'none',
      boxShadow: 'none',
    },
  ].filter(Boolean);

  return (
    <View className="mb-4">
      {label && (
        <Text className={`text-sm font-semibold mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </Text>
      )}
      
      <View className={`
        flex-row items-center rounded-xl ${getSizeClasses()} ${getVariantClasses()}
      `}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={size === 'large' ? 22 : size === 'small' ? 18 : 20} 
            color={error ? '#EF4444' : isFocused ? '#3B82F6' : (isDark ? '#9CA3AF' : '#6B7280')}
            style={{ marginRight: 12 }}
          />
        )}
        
        <TextInput
          className={`flex-1 ${getTextSize()} ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          style={inputStyle}
          selectionColor="#3B82F6"
          underlineColorAndroid="transparent"
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            className="ml-2"
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={size === 'large' ? 22 : size === 'small' ? 18 : 20}
              color={isFocused ? '#3B82F6' : (isDark ? '#9CA3AF' : '#6B7280')}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
} 