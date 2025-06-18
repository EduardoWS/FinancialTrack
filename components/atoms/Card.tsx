import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const Card: React.FC<CardProps> = ({ children, padding = 'md', className = '', ...props }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    none: ''
  };

  // Se className já contém padding, usar padding='none'
  const hasPaddingInClassName = className.includes('p-');
  const finalPadding = hasPaddingInClassName ? 'none' : padding;

  return (
    <View
      className={`
        rounded-xl shadow-sm
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        ${paddingClasses[finalPadding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card; 