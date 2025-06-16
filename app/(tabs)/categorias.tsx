import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Toast from '../../components/atoms/Toast';
import AddCategoryModal from '../../components/molecules/AddCategoryModal';
import { useTheme } from '../../services/ThemeContext';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

const CategoriasScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Estado inicial com categorias padrão
  const [categories, setCategories] = useState<Category[]>([
    // Categorias de Receita
    { id: '1', name: 'Salário', type: 'income', color: '#10b981', icon: '💰' },
    { id: '2', name: 'Freelance', type: 'income', color: '#06b6d4', icon: '💻' },
    { id: '3', name: 'Transferência', type: 'income', color: '#8b5cf6', icon: '🔄' },
    { id: '4', name: 'Investimentos', type: 'income', color: '#f59e0b', icon: '📈' },
    { id: '5', name: 'Outros', type: 'income', color: '#6b7280', icon: '💡' },
    
    // Categorias de Despesa
    { id: '6', name: 'Mercado', type: 'expense', color: '#ef4444', icon: '🛒' },
    { id: '7', name: 'Transporte', type: 'expense', color: '#f59e0b', icon: '🚗' },
    { id: '8', name: 'Lazer', type: 'expense', color: '#ec4899', icon: '🎮' },
    { id: '9', name: 'Moradia', type: 'expense', color: '#3b82f6', icon: '🏠' },
    { id: '10', name: 'Saúde', type: 'expense', color: '#06b6d4', icon: '🏥' },
    { id: '11', name: 'Educação', type: 'expense', color: '#8b5cf6', icon: '📚' },
    { id: '12', name: 'Outros', type: 'expense', color: '#6b7280', icon: '❓' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');

  const handleAddCategory = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      // Editar categoria existente
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData }
          : cat
      ));
      showToast('Categoria atualizada com sucesso!');
    } else {
      // Adicionar nova categoria
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryData
      };
      setCategories(prev => [...prev, newCategory]);
      showToast('Categoria adicionada com sucesso!');
    }
    
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      'Excluir Categoria',
      `Tem certeza que deseja excluir a categoria "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => prev.filter(cat => cat.id !== category.id));
            showToast('Categoria excluída com sucesso!');
          }
        }
      ]
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const openAddModal = () => {
    setModalVisible(true);
  };

  const filteredCategories = categories.filter(cat => cat.type === activeTab);
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const FilterButton = ({ 
    filter, 
    label, 
    count,
    color = 'red'
  }: { 
    filter: 'income' | 'expense'; 
    label: string; 
    count: number;
    color?: 'red' | 'green';
  }) => {
    const isActive = activeTab === filter;
    
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(filter)}
        className={`
          px-4 py-2 rounded-full border-2 min-w-[100px] items-center mr-3
          ${isActive 
            ? (color === 'green' 
              ? (isDark ? 'bg-green-600 border-green-600' : 'bg-green-600 border-green-600')
              : (isDark ? 'bg-red-600 border-red-600' : 'bg-red-600 border-red-600')
            )
            : (isDark ? 'bg-transparent border-gray-600' : 'bg-transparent border-gray-300')
          }
        `}
      >
        <Text className={`
          font-medium text-sm
          ${isActive 
            ? 'text-white' 
            : (isDark ? 'text-gray-300' : 'text-gray-700')
          }
        `}>
          {label}
        </Text>
        <Text className={`
          text-xs mt-1
          ${isActive 
            ? (color === 'green' ? 'text-green-100' : 'text-red-100')
            : (isDark ? 'text-gray-400' : 'text-gray-500')
          }
        `}>
          {count}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Categorias" />
      
      <View className="flex-1 p-4">
        {/* Filtros e Botão Adicionar Categoria */}
        <View className="flex-row justify-between items-center mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-1"
          >
            <FilterButton 
              filter="expense" 
              label="Despesas" 
              count={expenseCategories.length}
              color="red"
            />
            <FilterButton 
              filter="income" 
              label="Receitas" 
              count={incomeCategories.length}
              color="green"
            />
          </ScrollView>
          
          <TouchableOpacity
            onPress={openAddModal}
            className={`px-4 py-2 rounded-lg ml-3 ${
              activeTab === 'income' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <Text className="text-white font-medium text-sm">
              + Categoria
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Categorias */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {filteredCategories.length === 0 ? (
            <View className={`p-6 rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-sm items-center`}>
              <Text className="text-6xl mb-4">
                {activeTab === 'income' ? '💰' : '💳'}
              </Text>
              <Text className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Nenhuma categoria encontrada
              </Text>
              <Text className={`text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Adicione sua primeira categoria de {activeTab === 'income' ? 'receita' : 'despesa'} para começar a organizar suas transações!
              </Text>
              <TouchableOpacity
                onPress={openAddModal}
                className={`px-6 py-3 rounded-lg mt-4 ${
                  activeTab === 'income' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <Text className="text-white font-medium">
                  Criar Primeira Categoria
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredCategories.map(category => (
              <View 
                key={category.id} 
                className={`
                  flex-row items-center justify-between p-4 rounded-xl mb-3 shadow-sm
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                `}
              >
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-10 h-10 rounded-full justify-center items-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <Text className="text-lg">{category.icon}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <Text className={`text-base font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </Text>
                    <Text className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {category.type === 'income' ? 'Receita' : 'Despesa'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => handleEditCategory(category)}
                    className={`p-2 mr-2 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Text className={isDark ? 'text-blue-400' : 'text-blue-600'}>✏️</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(category)}
                    className={`p-2 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Text className="text-red-600">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          {/* Espaçamento final */}
          <View className="h-4" />
        </ScrollView>
      </View>

      {/* Modal de Adicionar/Editar */}
      <AddCategoryModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleAddCategory}
        editingCategory={editingCategory}
        defaultType={activeTab}
      />

      {/* Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
        type="success"
      />
    </SafeAreaView>
  );
};

export default CategoriasScreen;