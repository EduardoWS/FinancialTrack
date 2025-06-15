import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  disabled = false,
  style,
  ...props 
}: ButtonProps) {
  const getButtonClasses = () => {
    let baseClasses = 'rounded-lg flex-row items-center justify-center';
    
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
        baseClasses += ' bg-gray-200';
        break;
      case 'outline':
        baseClasses += ' border border-blue-500 bg-transparent';
        break;
      default:
        baseClasses += ' bg-blue-500';
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
        textClasses += ' text-gray-800';
        break;
      case 'outline':
        textClasses += ' text-blue-500';
        break;
      default:
        textClasses += ' text-white';
    }
    
    return textClasses;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      disabled={disabled || isLoading}
      style={style}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : '#3B82F6'} 
        />
      ) : (
        <Text className={getTextClasses()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
} 