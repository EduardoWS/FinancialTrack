import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import Toast from '../../components/atoms/Toast';
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

  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
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

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      showToast('Nome da categoria é obrigatório');
      return;
    }

    if (editingCategory) {
      // Editar categoria existente
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, name: formData.name.trim() }
          : cat
      ));
      showToast('Categoria atualizada com sucesso!');
    } else {
      // Adicionar nova categoria
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        name: formData.name.trim()
      };
      setCategories(prev => [...prev, newCategory]);
      showToast('Categoria adicionada com sucesso!');
    }

    closeModal();
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon
    });
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
    setFormData({
      name: '',
      type: 'expense',
      color: '#3b82f6',
      icon: '📌'
    });
  };

  const openAddModal = (type: 'income' | 'expense') => {
    setFormData({ ...formData, type });
    setModalVisible(true);
  };

  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: isDark ? '#111827' : '#f9fafb' 
    }}>
      <Header title="Categorias" />
      
      <View style={{ flex: 1, padding: 16 }}>
        {/* Tabs */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: isDark ? '#374151' : '#ffffff',
          borderRadius: 12,
          padding: 4,
          marginBottom: 20
        }}>
          <TouchableOpacity
            onPress={() => setActiveTab('expense')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: activeTab === 'expense' 
                ? (isDark ? '#ef4444' : '#ef4444') 
                : 'transparent'
            }}
          >
            <Text style={{
              textAlign: 'center',
              fontWeight: '600',
              color: activeTab === 'expense' 
                ? '#ffffff' 
                : (isDark ? '#d1d5db' : '#6b7280')
            }}>
              Despesas ({categories.filter(c => c.type === 'expense').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('income')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: activeTab === 'income' 
                ? (isDark ? '#10b981' : '#10b981') 
                : 'transparent'
            }}
          >
            <Text style={{
              textAlign: 'center',
              fontWeight: '600',
              color: activeTab === 'income' 
                ? '#ffffff' 
                : (isDark ? '#d1d5db' : '#6b7280')
            }}>
              Receitas ({categories.filter(c => c.type === 'income').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Categorias */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 20 }}>
            {filteredCategories.map(category => (
              <View key={category.id} style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDark ? '#374151' : '#ffffff',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: category.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    <Text style={{ fontSize: 20 }}>{category.icon}</Text>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: isDark ? '#ffffff' : '#111827'
                    }}>
                      {category.name}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: isDark ? '#9ca3af' : '#6b7280'
                    }}>
                      {category.type === 'income' ? 'Receita' : 'Despesa'}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => handleEditCategory(category)}
                    style={{
                      padding: 8,
                      marginRight: 8,
                      borderRadius: 8,
                      backgroundColor: isDark ? '#4b5563' : '#f3f4f6'
                    }}
                  >
                    <Text style={{ color: isDark ? '#60a5fa' : '#3b82f6' }}>✏️</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(category)}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      backgroundColor: isDark ? '#4b5563' : '#f3f4f6'
                    }}
                  >
                    <Text style={{ color: '#ef4444' }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Botão Adicionar */}
        <TouchableOpacity
          onPress={() => openAddModal(activeTab)}
          style={{
            backgroundColor: activeTab === 'income' ? '#10b981' : '#ef4444',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 16
          }}
        >
          <Text style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600'
          }}>
            + Adicionar {activeTab === 'income' ? 'Categoria de Receita' : 'Categoria de Despesa'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Adicionar/Editar */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: isDark ? '#374151' : '#ffffff',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#111827',
              marginBottom: 20,
              textAlign: 'center'
            }}>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </Text>

            {/* Nome */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#d1d5db' : '#374151',
              marginBottom: 8
            }}>
              Nome da Categoria
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ex: Mercado, Transporte..."
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              style={{
                backgroundColor: isDark ? '#4b5563' : '#f9fafb',
                borderWidth: 1,
                borderColor: isDark ? '#6b7280' : '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: isDark ? '#ffffff' : '#111827',
                marginBottom: 16
              }}
            />

            {/* Tipo */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#d1d5db' : '#374151',
              marginBottom: 8
            }}>
              Tipo
            </Text>
            <View style={{
              flexDirection: 'row',
              marginBottom: 16
            }}>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, type: 'income' })}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  marginRight: 8,
                  backgroundColor: formData.type === 'income' ? '#10b981' : (isDark ? '#4b5563' : '#f3f4f6'),
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: formData.type === 'income' ? '#ffffff' : (isDark ? '#d1d5db' : '#374151'),
                  fontWeight: '600'
                }}>
                  Receita
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, type: 'expense' })}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: formData.type === 'expense' ? '#ef4444' : (isDark ? '#4b5563' : '#f3f4f6'),
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: formData.type === 'expense' ? '#ffffff' : (isDark ? '#d1d5db' : '#374151'),
                  fontWeight: '600'
                }}>
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cor */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#d1d5db' : '#374151',
              marginBottom: 8
            }}>
              Cor
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 16
            }}>
              {availableColors.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setFormData({ ...formData, color })}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: color,
                    margin: 4,
                    borderWidth: formData.color === color ? 3 : 0,
                    borderColor: isDark ? '#ffffff' : '#000000'
                  }}
                />
              ))}
            </View>

            {/* Ícone */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#d1d5db' : '#374151',
              marginBottom: 8
            }}>
              Ícone
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 24 }}
            >
              <View style={{ flexDirection: 'row' }}>
                {availableIcons.map(icon => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setFormData({ ...formData, icon })}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: formData.icon === icon ? formData.color : (isDark ? '#4b5563' : '#f3f4f6'),
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Botões */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: isDark ? '#4b5563' : '#f3f4f6',
                  marginRight: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: isDark ? '#d1d5db' : '#374151',
                  fontWeight: '600'
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAddCategory}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: formData.type === 'income' ? '#10b981' : '#ef4444',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {editingCategory ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      <Toast
        message={toastMessage}
        type="success"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default CategoriasScreen;