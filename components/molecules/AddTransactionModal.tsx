import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Transaction } from '../../data/mockData';
import { useTheme } from '../../services/ThemeContext';

interface NewTransaction {
  description: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

// Componente InputField movido para fora para evitar perda de foco
const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  placeholder,
  keyboardType = 'default',
  multiline = false,
  isDark
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  isDark: boolean;
}) => (
  <View className="mb-4">
    <Text className={`text-sm font-medium mb-2 ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
      keyboardType={keyboardType}
      multiline={multiline}
      className={`
        p-3 rounded-lg border text-base
        ${error 
          ? 'border-red-500' 
          : (isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900')
        }
        ${multiline ? 'h-20' : 'h-12'}
      `}
    />
    {error && (
      <Text className="text-red-500 text-sm mt-1">{error}</Text>
    )}
  </View>
);

// Componente TypeButton movido para fora
const TypeButton = ({ 
  type, 
  label, 
  icon,
  isActive,
  onPress,
  isDark
}: { 
  type: 'income' | 'expense'; 
  label: string; 
  icon: string;
  isActive: boolean;
  onPress: () => void;
  isDark: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`
      flex-1 p-4 rounded-lg border-2 items-center
      ${isActive 
        ? (type === 'income' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
        : (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300')
      }
    `}
  >
    <Text className={`text-2xl mb-2`}>{icon}</Text>
    <Text className={`
      font-medium
      ${isActive 
        ? (type === 'income' ? 'text-green-700' : 'text-red-700')
        : (isDark ? 'text-gray-300' : 'text-gray-700')
      }
    `}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Componente CategoryButton movido para fora
const CategoryButton = ({ 
  category,
  isActive,
  onPress,
  isDark
}: { 
  category: string;
  isActive: boolean;
  onPress: () => void;
  isDark: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`
      px-4 py-2 rounded-full border-2 mr-2 mb-2
      ${isActive 
        ? (isDark ? 'bg-blue-600 border-blue-600' : 'bg-blue-600 border-blue-600')
        : (isDark ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-300')
      }
    `}
  >
    <Text className={`
      font-medium
      ${isActive 
        ? 'text-white' 
        : (isDark ? 'text-gray-300' : 'text-gray-700')
      }
    `}>
      {category}
    </Text>
  </TouchableOpacity>
);

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  visible, 
  onClose, 
  onAdd 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [formData, setFormData] = useState<NewTransaction>({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toLocaleDateString('pt-BR')
  });

  const [errors, setErrors] = useState<Partial<NewTransaction>>({});

  const categories = {
    income: ['Salário', 'Freelance', 'Transferência', 'Investimentos', 'Outros'],
    expense: ['Mercado', 'Transporte', 'Lazer', 'Moradia', 'Saúde', 'Educação', 'Outros']
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NewTransaction> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Valor é obrigatório';
    } else if (isNaN(parseFloat(formData.amount.replace(',', '.')))) {
      newErrors.amount = 'Valor deve ser um número válido';
    } else if (parseFloat(formData.amount.replace(',', '.')) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const amount = parseFloat(formData.amount.replace(',', '.'));
    const transaction: Omit<Transaction, 'id'> = {
      description: formData.description.trim(),
      amount: formData.type === 'expense' ? -amount : amount,
      type: formData.type,
      category: formData.category,
      date: formData.date
    };

    onAdd(transaction);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toLocaleDateString('pt-BR')
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({ ...prev, type, category: '' }));
    setErrors(prev => ({ ...prev, category: undefined }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
    setErrors(prev => ({ ...prev, category: undefined }));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Fundo desfocado */}
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
        {/* Container do modal centralizado */}
        <View 
          className={`
            rounded-2xl shadow-2xl max-h-[90%]
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}
          style={{
            width: Math.min(screenWidth * 0.9, 500),
            maxHeight: screenHeight * 0.9
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
              Cadastrar Transação
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

          {/* Formulário */}
          <ScrollView 
            className="flex-1 px-6 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Tipo de transação */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Transação
              </Text>
              <View className="flex-row space-x-4">
                <TypeButton 
                  type="income" 
                  label="Entrada" 
                  icon="↗️"
                  isActive={formData.type === 'income'}
                  onPress={() => handleTypeChange('income')}
                  isDark={isDark}
                />
                <TypeButton 
                  type="expense" 
                  label="Saída" 
                  icon="↙️"
                  isActive={formData.type === 'expense'}
                  onPress={() => handleTypeChange('expense')}
                  isDark={isDark}
                />
              </View>
            </View>

            {/* Descrição */}
            <InputField
              label="Descrição"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Ex: Supermercado, Salário, etc."
              error={errors.description}
              isDark={isDark}
            />

            {/* Valor */}
            <InputField
              label="Valor"
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0,00"
              keyboardType="numeric"
              error={errors.amount}
              isDark={isDark}
            />

            {/* Categoria */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Categoria
              </Text>
              <View className="flex-row flex-wrap">
                {categories[formData.type].map((category) => (
                  <CategoryButton 
                    key={category} 
                    category={category}
                    isActive={formData.category === category}
                    onPress={() => handleCategoryChange(category)}
                    isDark={isDark}
                  />
                ))}
              </View>
              {errors.category && (
                <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
              )}
            </View>

            {/* Data */}
            <InputField
              label="Data"
              value={formData.date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
              placeholder="DD/MM/AAAA"
              error={errors.date}
              isDark={isDark}
            />

            {/* Espaçamento inferior */}
            <View className="h-4" />
          </ScrollView>

          {/* Footer com botões */}
          <View className={`
            p-6 border-t flex-row space-x-4
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
              onPress={handleSubmit}
              className="flex-1 py-3 rounded-lg bg-blue-600"
            >
              <Text className="text-center font-medium text-white">
                Cadastrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTransactionModal; 