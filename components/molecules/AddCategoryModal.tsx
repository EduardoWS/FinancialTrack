import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  editingCategory?: Category | null;
  defaultType: 'income' | 'expense';
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  visible,
  onClose,
  onSave,
  editingCategory,
  defaultType
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [formData, setFormData] = useState({
    name: '',
    type: defaultType,
    color: '#3b82f6',
    icon: '📌'
  });

  const availableColors = [
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
  ];

  const availableIcons = [
    '💰', '💻', '🔄', '📈', '💡', '🛒', '🚗', '🎮', 
    '🏠', '🏥', '📚', '❓', '🍔', '⛽', '👕', '🎬', 
    '📱', '💊', '🎯', '📌'
  ];

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        type: editingCategory.type,
        color: editingCategory.color,
        icon: editingCategory.icon
      });
    } else {
      resetForm();
    }
  }, [editingCategory, visible, defaultType]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: defaultType,
      color: defaultType === 'income' ? '#10b981' : '#ef4444',
      icon: '📌'
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da categoria é obrigatório');
      return;
    }

    const categoryData: Omit<Category, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      color: formData.color,
      icon: formData.icon
    };

    onSave(categoryData);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
        <View 
          className={`
            rounded-2xl shadow-2xl
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}
          style={{
            width: Math.min(screenWidth * 0.9, 500),
            maxHeight: screenHeight * 0.8
          }}
        >
          {/* Header */}
          <View className={`
            flex-row items-center justify-between p-6 border-b
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <Text className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className={`
                w-8 h-8 rounded-full items-center justify-center
                ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
              `}
            >
              <Text className={`text-lg font-bold ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo */}
          <ScrollView 
            className="flex-1 px-6 py-4" 
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenHeight * 0.8 - 160 }}
          >
            {/* Nome */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nome da Categoria
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ex: Mercado, Transporte..."
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                className={`border rounded-lg p-3 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </View>

            {/* Tipo */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Categoria
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, type: 'expense' })}
                  className={`
                    flex-1 p-3 rounded-lg border-2 items-center
                    ${formData.type === 'expense' 
                      ? 'bg-red-100 border-red-500' 
                      : (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300')
                    }
                  `}
                >
                  <Text className="text-2xl mb-1">💳</Text>
                  <Text className={`font-medium ${
                    formData.type === 'expense' ? 'text-red-700' : (isDark ? 'text-gray-300' : 'text-gray-700')
                  }`}>
                    Despesa
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, type: 'income' })}
                  className={`
                    flex-1 p-3 rounded-lg border-2 items-center
                    ${formData.type === 'income' 
                      ? 'bg-green-100 border-green-500' 
                      : (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300')
                    }
                  `}
                >
                  <Text className="text-2xl mb-1">💰</Text>
                  <Text className={`font-medium ${
                    formData.type === 'income' ? 'text-green-700' : (isDark ? 'text-gray-300' : 'text-gray-700')
                  }`}>
                    Receita
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cor */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cor da Categoria
              </Text>
              <View className="flex-row flex-wrap">
                {availableColors.map(color => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setFormData({ ...formData, color })}
                    className={`
                      w-10 h-10 rounded-full m-1 border-2
                      ${formData.color === color ? (isDark ? 'border-white' : 'border-gray-700') : 'border-transparent'}
                    `} 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>

            {/* Ícone */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ícone da Categoria
              </Text>
              <View className="flex-row flex-wrap">
                {availableIcons.map(icon => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setFormData({ ...formData, icon })}
                    className={`
                      w-10 h-10 rounded-lg m-1 items-center justify-center border-2
                      ${formData.icon === icon 
                        ? (isDark ? 'border-blue-500 bg-blue-100/20' : 'border-blue-500 bg-blue-50')
                        : (isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100')
                      }
                    `}
                  >
                    <Text className="text-lg">{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className={`
            p-6 border-t flex-row space-x-3
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <TouchableOpacity
              onPress={handleClose}
              className={`
                flex-1 py-3 rounded-lg border-2
                ${isDark ? 'border-gray-600' : 'border-gray-300'}
              `}
            >
              <Text className={`
                text-center font-medium
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                Cancelar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSave}
              className={`
                flex-1 py-3 rounded-lg
                ${formData.type === 'income' ? 'bg-green-600' : 'bg-red-600'}
              `}
            >
              <Text className="text-white font-medium text-center">
                {editingCategory ? 'Atualizar' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal; 