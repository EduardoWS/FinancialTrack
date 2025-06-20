import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import ScreenLoader from '../../components/atoms/ScreenLoader';
import { errorToast, successToast } from '../../components/atoms/custom-toasts';
import AddCategoryModal from '../../components/molecules/AddCategoryModal';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import { useCategorias } from '../../hooks/useCategorias';
import { useTheme } from '../../services/ThemeContext';
import { Category } from '../../services/categoriasService';

const CategoriasScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Estado inicial com categorias padrão
  const {
    incomeCategories,
    expenseCategories,
    loading,
    error, // Podemos usar isso para mostrar feedback de erro
    adicionarCategoria,
    atualizarCategoria,
    excluirCategoria,
  } = useCategorias();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleSaveCategory = async (categoryData: Omit<Category, 'id' | 'isDefault'>) => {
    try {
      if (editingCategory) {
        // Editar categoria existente
        await atualizarCategoria(editingCategory.id, categoryData);
        successToast('Categoria atualizada!');
      } else {
        // Adicionar nova categoria
        await adicionarCategoria(categoryData);
        successToast('Categoria adicionada!');
      }
      closeModal();
    } catch (err: any) {
      errorToast('Erro', err.message);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalVisible(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      excluirCategoria(categoryToDelete.id);
      successToast('Categoria excluída com sucesso!');
      setDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const openAddModal = () => {
    setModalVisible(true);
  };

  const filteredCategories = activeTab === 'income' ? incomeCategories : expenseCategories;

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
          flex-1 py-2 px-2 rounded-lg border items-center mx-1
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
          font-medium text-sm text-center
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

  if (loading) {
    return <ScreenLoader title="Categorias" text="Carregando categorias..." />;
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Categorias" />
      
      <View className="flex-1 p-4">
        {/* Filtros e Botão Adicionar Categoria organizados verticalmente para mobile */}
        <View className="mb-6">
          <View className="flex-row mb-3">
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
          </View>
          
          <TouchableOpacity
            onPress={openAddModal}
            className={`py-3 px-4 rounded-lg ${
              activeTab === 'income' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <Text className="text-white font-medium text-center">
              Adicionar Nova Categoria
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
                  flex-row items-center justify-between rounded-xl mb-3 shadow-sm overflow-hidden
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                `}
              >
                {/* Faixa colorida à esquerda */}
                <View 
                  className="w-4 h-full absolute left-0 top-0 bottom-0"
                  style={{ backgroundColor: category.color }}
                />
                
                <View className="flex-row items-center flex-1 p-4">
                  <View className="w-8 h-8 justify-center items-center mx-4">
                    <Text className="text-2xl">{category.icon}</Text>
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

                <View className="flex-row p-4">
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
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        defaultType={activeTab}
      />

      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteCategory}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${categoryToDelete?.name}"?`}
      />
    </SafeAreaView>
  );
};

export default CategoriasScreen;