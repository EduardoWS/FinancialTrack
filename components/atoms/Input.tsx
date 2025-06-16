import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({ 
  label, 
  error, 
  icon, 
  isPassword = false, 
  style,
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      
      <View className={`
        flex-row items-center border rounded-lg px-4 py-3
        ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300'}
        ${error ? 'bg-red-50' : 'bg-white'}
      `}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={error ? '#EF4444' : isFocused ? '#3B82F6' : '#6B7280'}
            style={{ marginRight: 12 }}
          />
        )}
        
        <TextInput
          className="flex-1 text-gray-800 text-base"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
          style={inputStyle}
          selectionColor="#3B82F6"
          underlineColorAndroid="transparent"
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={isFocused ? '#3B82F6' : '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
} 