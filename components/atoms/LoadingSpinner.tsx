import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  text = 'Carregando...', 
  className = '' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`items-center justify-center ${className}`}>
      <View className={`
        p-6 rounded-xl shadow-sm
        ${isDark ? 'bg-gray-800' : 'bg-white'}
      `}>
        <ActivityIndicator 
          size={size} 
          color={isDark ? '#60A5FA' : '#3B82F6'} 
        />
        {text && (
          <Text className={`
            mt-3 text-center font-medium
            ${isDark ? 'text-gray-300' : 'text-gray-600'}
          `}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};

export default LoadingSpinner; 