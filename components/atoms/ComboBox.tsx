import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import { useScreenSize } from '../../hooks/useScreenSize';

export interface ComboBoxItem<T = string> {
  label: string;
  value: T;
}

interface ComboBoxProps<T = string> {
  items: ComboBoxItem<T>[];
  selectedValue: T | null;
  onValueChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ComboBox = <T extends string | number = string>({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Selecione',
  disabled = false,
  className = '',
}: ComboBoxProps<T>) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const { isMobile } = useScreenSize();

  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    items.find((i) => i.value === selectedValue)?.label || placeholder;

  const handleSelect = (value: T) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.8}
        className={`flex-row items-center justify-between px-4 py-3 rounded-xl border-2 ${
          disabled
            ? isDark
              ? 'border-gray-700 bg-gray-800 opacity-60'
              : 'border-gray-300 bg-gray-100 opacity-60'
            : isDark
            ? 'border-gray-600 bg-gray-800'
            : 'border-gray-300 bg-gray-50'
        } ${className}`}
      >
        <Text
          className={`flex-1 text-base ${
            selectedValue
              ? isDark
                ? 'text-white'
                : 'text-gray-900'
              : isDark
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}
        >
          {selectedLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={isDark ? '#D1D5DB' : '#4B5563'}
        />
      </TouchableOpacity>

      {/* Modal de seleção */}
      <Modal
        visible={modalVisible}
        transparent
        animationType={isMobile ? 'slide' : 'fade'}
        onRequestClose={() => setModalVisible(false)}
      >
        {isMobile ? (
          <View className="flex-1 bg-black bg-opacity-50 justify-end">
            <View
              className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl max-h-[80vh]`}
            >
              <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={String(item.value)}
                    onPress={() => handleSelect(item.value)}
                    className={`py-3 flex-row items-center border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className={`p-4 items-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Web modal centralizado
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
            <View
              className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl w-full max-w-[400px] max-h-[80vh] overflow-hidden`}
            >
              <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={String(item.value)}
                    onPress={() => handleSelect(item.value)}
                    className={`py-3 flex-row items-center border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className={`p-4 items-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </>
  );
};

export default ComboBox; 