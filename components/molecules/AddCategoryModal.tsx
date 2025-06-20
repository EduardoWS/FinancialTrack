import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const isWeb = Platform.OS === 'web';
  const isMobile = screenWidth < 768;

  const [formData, setFormData] = useState({
    name: '',
    type: defaultType,
    color: '#3b82f6',
    icon: '📌'
  });

  const availableColors = [
    '#EF4444', '#F59E0B', '#10B981', '#06B6D4', 
    '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280',
    '#F97316', '#84CC16', '#14B8A6', '#6366F1'
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

  const renderMobileModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-end">
      <View className={`
        rounded-t-3xl min-h-[85vh] max-h-[95vh]
        ${isDark ? 'bg-gray-900' : 'bg-white'}
      `}>
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
              w-10 h-10 rounded-full items-center justify-center
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
            `}
          >
            <Ionicons name="close" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>

        {/* Footer */}
        <View className={`
          p-6 border-t flex-row space-x-4
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <TouchableOpacity
            onPress={handleClose}
            className={`
              flex-1 py-4 rounded-xl border-2
              ${isDark ? 'border-gray-600' : 'border-gray-300'}
            `}
          >
            <Text className={`
              text-center font-semibold text-base
              ${isDark ? 'text-gray-300' : 'text-gray-700'}
            `}>
              Cancelar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSave}
            className={`
              flex-1 py-4 rounded-xl
              ${formData.type === 'income' ? 'bg-green-600' : 'bg-red-600'}
            `}
          >
            <Text className="text-white font-semibold text-base text-center">
              {editingCategory ? 'Atualizar' : 'Criar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderWebModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-6">
      <View 
        className={`
          rounded-2xl shadow-2xl
          ${isDark ? 'bg-gray-900' : 'bg-white'}
        `}
        style={{
          width: Math.min(screenWidth * 0.85, 800),
          maxHeight: screenHeight * 0.85
        }}
      >
        {/* Header */}
        <View className={`
          flex-row items-center justify-between p-6 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <Text className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className={`
              w-10 h-10 rounded-full items-center justify-center
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
            `}
          >
            <Ionicons name="close" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Content in two columns for web */}
        <View className="flex-row flex-1">
          <ScrollView 
            className="flex-1 p-6" 
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </View>

        {/* Footer */}
        <View className={`
          p-6 border-t flex-row space-x-4 justify-end
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <TouchableOpacity
            onPress={handleClose}
            className={`
              px-8 py-3 rounded-xl border-2
              ${isDark ? 'border-gray-600' : 'border-gray-300'}
            `}
          >
            <Text className={`
              font-semibold text-base
              ${isDark ? 'text-gray-300' : 'text-gray-700'}
            `}>
              Cancelar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSave}
            className={`
              px-8 py-3 rounded-xl
              ${formData.type === 'income' ? 'bg-green-600' : 'bg-red-600'}
            `}
          >
            <Text className="text-white font-semibold text-base">
              {editingCategory ? 'Atualizar Categoria' : 'Criar Categoria'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContent = () => (
    <>
      {/* Nome */}
      <View className="mb-6">
        <Text className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Nome da Categoria
        </Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ex: Supermercado, Transporte..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          className={`border rounded-xl p-4 text-base ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-gray-50 border-gray-300 text-gray-900'
          }`}
        />
      </View>

      {/* Tipo */}
      <View className="mb-6">
        <Text className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Tipo de Categoria
        </Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={() => setFormData({ ...formData, type: 'expense' })}
            className={`
              flex-1 p-4 rounded-xl border-2 items-center
              ${formData.type === 'expense' 
                ? 'bg-red-500/20 border-red-500' 
                : (isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300')
              }
            `}
          >
            <Ionicons 
              name="trending-down" 
              size={24} 
              color={formData.type === 'expense' ? '#EF4444' : (isDark ? '#9CA3AF' : '#6B7280')}
              style={{ marginBottom: 8 }}
            />
            <Text className={`font-semibold ${
              formData.type === 'expense' ? 'text-red-600' 
              : (isDark ? 'text-gray-300' : 'text-gray-700')
            }`}>
              Despesa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFormData({ ...formData, type: 'income' })}
            className={`
              flex-1 p-4 rounded-xl border-2 items-center
              ${formData.type === 'income' 
                ? 'bg-green-500/20 border-green-500' 
                : (isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300')
              }
            `}
          >
            <Ionicons 
              name="trending-up" 
              size={24} 
              color={formData.type === 'income' ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280')}
              style={{ marginBottom: 8 }}
            />
            <Text className={`font-semibold ${
              formData.type === 'income' ? 'text-green-600' : (isDark ? 'text-gray-300' : 'text-gray-700')
            }`}>
              Receita
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cor */}
      <View className="mb-6">
        <Text className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Cor da Categoria
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {availableColors.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setFormData({ ...formData, color })}
              className={`
                w-12 h-12 rounded-xl border-4 items-center justify-center
                ${formData.color === color ? 'border-gray-800' : 'border-transparent'}
              `} 
              style={{ backgroundColor: color }}
            >
              {formData.color === color && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ícone */}
      <View className="mb-6">
        <Text className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Ícone da Categoria
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {availableIcons.map(icon => (
            <TouchableOpacity
              key={icon}
              onPress={() => setFormData({ ...formData, icon })}
              className={`
                w-12 h-12 rounded-xl items-center justify-center border-2
                ${formData.icon === icon 
                  ? (isDark ? 'border-blue-500 bg-blue-500/20' : 'border-blue-500 bg-blue-50')
                  : (isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50')
                }
              `}
            >
              <Text className="text-xl">{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={isMobile ? "slide" : "fade"}
      onRequestClose={handleClose}
    >
      {isMobile ? renderMobileModal() : renderWebModal()}
    </Modal>
  );
};

export default AddCategoryModal; 