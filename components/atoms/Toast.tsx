import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  visible, 
  onHide, 
  duration = 5000 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(100));
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (visible) {
      // Mostrar toast
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto esconder após duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastStyles = () => {
    const baseStyle = {
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      maxWidth: screenWidth * 0.9,
      minWidth: 280,
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: isDark ? '#065f46' : '#d1fae5',
          borderLeftColor: '#10b981',
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
          borderLeftColor: '#ef4444',
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: isDark ? '#78350f' : '#fef3c7',
          borderLeftColor: '#f59e0b',
        };
      case 'info':
      default:
        return {
          ...baseStyle,
          backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
          borderLeftColor: '#3b82f6',
        };
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return isDark ? '#a7f3d0' : '#065f46';
      case 'error':
        return isDark ? '#fca5a5' : '#7f1d1d';
      case 'warning':
        return isDark ? '#fde68a' : '#78350f';
      case 'info':
      default:
        return isDark ? '#93c5fd' : '#1e3a8a';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
        position: 'absolute',
        bottom: 100,
        left: 16,
        zIndex: 1000,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <View style={getToastStyles()}>
        <Text style={{ 
          fontSize: 18, 
          marginRight: 12, 
          fontWeight: 'bold',
          color: getTextColor() 
        }}>
          {getIcon()}
        </Text>
        <Text style={{ 
          flex: 1, 
          fontWeight: '600',
          fontSize: 14,
          color: getTextColor() 
        }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default Toast; 