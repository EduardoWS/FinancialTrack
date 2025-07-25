import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useCategorias } from '../../hooks/useCategorias';
import { useTheme } from '../../services/ThemeContext';
import { Transaction } from '../../services/transacoesService';
import ComboBox, { ComboBoxItem } from '../atoms/ComboBox';

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
  onSave: (transaction: Omit<Transaction, 'id'>, id?: string) => void;
  editingTransaction?: Transaction | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  visible, 
  onClose, 
  onSave,
  editingTransaction
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isWeb = Platform.OS === 'web';
  const isMobile = screenWidth < 768;

  const [formData, setFormData] = useState<NewTransaction>({
    description: '',
    amount: '',
    type: 'income',
    category: '',
    date: new Date().toLocaleDateString('pt-BR')
  });

  const [errors, setErrors] = useState<Partial<NewTransaction>>({});

  // Carregar categorias do usuário
  const { incomeCategories, expenseCategories, loading: catLoading } = useCategorias();

  const categoryOptions: ComboBoxItem<string>[] = (formData.type === 'income'
    ? incomeCategories
    : expenseCategories
  ).map((c) => ({ label: c.name, value: c.name }));

  useEffect(() => {
    if (editingTransaction && visible) {
      setFormData({
        description: editingTransaction.description,
        amount: String(Math.abs(editingTransaction.amount)),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: typeof editingTransaction.date === 'string'
          ? editingTransaction.date
          : editingTransaction.date.toLocaleDateString('pt-BR'),
      });
    } else {
      resetForm();
    }
  }, [editingTransaction, visible]);

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

    onSave(transaction, editingTransaction?.id);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      type: 'income',
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
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
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
          p-6 border-t flex-row
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <TouchableOpacity
            onPress={handleClose}
            className={`mr-4
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
            onPress={handleSubmit}
            className="flex-1 py-4 rounded-xl bg-blue-600"
          >
            <Text className="text-center font-semibold text-base text-white">
              {editingTransaction ? 'Atualizar' : 'Cadastrar'}
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
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
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
        <ScrollView 
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>

        {/* Footer */}
        <View className={`
          p-6 border-t flex-row justify-end
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <TouchableOpacity
            onPress={handleClose}
            className={`
              px-8 py-3 rounded-xl border-2 mr-4
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
            onPress={handleSubmit}
            className="px-8 py-3 rounded-xl bg-blue-600"
          >
            <Text className="text-white font-semibold text-base">
              {editingTransaction ? 'Atualizar Transação' : 'Cadastrar Transação'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContent = () => (
    <View className={isWeb && !isMobile ? "flex-row" : ""}>
      {/* Coluna 1 - Informações básicas */}
      <View className={isWeb && !isMobile ? "flex-1 mr-8" : ""}>
        {/* Tipo de transação */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Tipo de Transação
          </Text>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => handleTypeChange('income')}
              className={`mr-4
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
            
            <TouchableOpacity 
              onPress={() => handleTypeChange('expense')}
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
                formData.type === 'expense' ? 'text-red-600' : (isDark ? 'text-gray-300' : 'text-gray-700')
              }`}>
                Despesa
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrição */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Descrição
          </Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Ex: Supermercado, Salário, etc."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            className={`
              p-4 rounded-xl border text-base
              ${errors.description 
                ? 'border-red-500' 
                : (isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-gray-900')
              }
            `}
          />
          {errors.description && (
            <Text className="text-red-500 text-sm mt-1">{errors.description}</Text>
          )}
        </View>

        {/* Valor */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Valor
          </Text>
          <TextInput
            value={formData.amount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
            placeholder="0,00"
            keyboardType="numeric"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            className={`
              p-4 rounded-xl border text-base
              ${errors.amount 
                ? 'border-red-500' 
                : (isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-gray-900')
              }
            `}
          />
          {errors.amount && (
            <Text className="text-red-500 text-sm mt-1">{errors.amount}</Text>
          )}
        </View>
      </View>

      {/* Coluna 2 - Categoria e Data */}
      <View className={isWeb && !isMobile ? "flex-1" : ""}>
        {/* Categoria */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Categoria
          </Text>
          <ComboBox
            items={categoryOptions}
            selectedValue={formData.category || null}
            onValueChange={(val: string) => handleCategoryChange(val)}
            placeholder={catLoading ? 'Carregando...' : 'Selecione a categoria'}
            disabled={catLoading || categoryOptions.length === 0}
          />
          {errors.category && (
            <Text className="text-red-500 text-sm mt-1">{errors.category}</Text>
          )}
        </View>

        {/* Data */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Data
          </Text>
          <TextInput
            value={formData.date}
            onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            className={`
              p-4 rounded-xl border text-base
              ${errors.date 
                ? 'border-red-500' 
                : (isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50 text-gray-900')
              }
            `}
          />
          {errors.date && (
            <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
          )}
        </View>
      </View>
    </View>
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

export default AddTransactionModal; 