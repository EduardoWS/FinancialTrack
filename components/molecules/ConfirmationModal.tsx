import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({ visible, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      >
        <View className={`w-11/12 max-w-sm rounded-2xl p-6 shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </Text>
          <Text className={`text-base mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {message}
          </Text>

          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={onClose}
              className={`px-6 py-3 rounded-lg mr-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="px-6 py-3 rounded-lg bg-red-600"
            >
              <Text className="font-semibold text-white">
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal; 