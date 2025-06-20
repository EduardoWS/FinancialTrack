import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  ...props 
}: ButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getButtonClasses = () => {
    let baseClasses = 'rounded-xl flex-row items-center justify-center';
    
    // Full width
    if (fullWidth) {
      baseClasses += ' w-full';
    }
    
    // Size classes
    switch (size) {
      case 'small':
        baseClasses += ' px-4 py-2';
        break;
      case 'large':
        baseClasses += ' px-8 py-4';
        break;
      default:
        baseClasses += ' px-6 py-3';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        baseClasses += isDark ? ' bg-gray-700 border border-gray-600' : ' bg-gray-100 border border-gray-300';
        break;
      case 'outline':
        baseClasses += isDark ? ' border-2 border-blue-500 bg-transparent' : ' border-2 border-blue-500 bg-transparent';
        break;
      case 'ghost':
        baseClasses += ' bg-transparent';
        break;
      case 'danger':
        baseClasses += ' bg-red-600';
        break;
      default:
        baseClasses += ' bg-blue-600';
    }
    
    // Disabled state
    if (disabled || isLoading) {
      baseClasses += ' opacity-50';
    }
    
    return baseClasses;
  };

  const getTextClasses = () => {
    let textClasses = 'font-semibold text-center';
    
    // Size classes
    switch (size) {
      case 'small':
        textClasses += ' text-sm';
        break;
      case 'large':
        textClasses += ' text-lg';
        break;
      default:
        textClasses += ' text-base';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        textClasses += isDark ? ' text-gray-200' : ' text-gray-800';
        break;
      case 'outline':
        textClasses += ' text-blue-600';
        break;
      case 'ghost':
        textClasses += isDark ? ' text-gray-300' : ' text-gray-700';
        break;
      case 'danger':
        textClasses += ' text-white';
        break;
      default:
        textClasses += ' text-white';
    }
    
    return textClasses;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'secondary':
        return isDark ? '#E5E7EB' : '#374151';
      case 'outline':
        return '#2563EB';
      case 'ghost':
        return isDark ? '#D1D5DB' : '#374151';
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 22;
      default:
        return 18;
    }
  };

  const renderIcon = () => {
    if (!icon || isLoading) return null;
    
    return (
      <Ionicons 
        name={icon} 
        size={getIconSize()} 
        color={getIconColor()}
        style={iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? 'white' : '#3B82F6'} 
        />
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        <Text className={getTextClasses()}>{title}</Text>
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      disabled={disabled || isLoading}
      style={style}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
} 