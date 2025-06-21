import React from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import Header from '../Header';
import LoadingSpinner from './LoadingSpinner';

interface ScreenLoaderProps {
  title: string;
  text?: string;
}

const ScreenLoader = ({ title, text }: ScreenLoaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title={title} />
      <LoadingSpinner className="flex-1" text={text} />
    </SafeAreaView>
  );
};

export default ScreenLoader; 