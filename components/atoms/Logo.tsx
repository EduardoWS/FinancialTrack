import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ size = 'medium' }: LogoProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 24,
          textSize: 'text-lg',
          spacing: 'mb-4'
        };
      case 'large':
        return {
          iconSize: 48,
          textSize: 'text-3xl',
          spacing: 'mb-8'
        };
      default:
        return {
          iconSize: 32,
          textSize: 'text-2xl',
          spacing: 'mb-6'
        };
    }
  };

  const { iconSize, textSize, spacing } = getSizeClasses();

  return (
    <View className={`items-center ${spacing}`}>
      <View className="flex-row items-center">
        <Ionicons 
          name="stats-chart" 
          size={iconSize} 
          color="#3B82F6" 
          style={{ marginRight: 8 }}
        />
        <Text className={`font-bold text-blue-600 ${textSize}`}>
          Financial Track
        </Text>
      </View>
    </View>
  );
} 