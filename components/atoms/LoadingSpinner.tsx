import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Carregando...', 
  className = '' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`justify-center items-center ${className}`}>
      <ActivityIndicator 
        size="large" 
        color={isDark ? '#60A5FA' : '#3B82F6'} 
      />
      {text && (
        <Text className={`
          mt-2 text-sm
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
        `}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner; 