import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Meta } from '../../hooks/useMetas';
import { useTheme } from '../../services/ThemeContext';

interface AddMetaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (meta: Omit<Meta, 'id'>) => void;
  editingMeta?: Meta | null;
}

const AddMetaModal: React.FC<AddMetaModalProps> = ({ 
  visible, 
  onClose, 
  onSave, 
  editingMeta 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [formData, setFormData] = useState({
    nome: '',
    valorMeta: '',
    valorAtual: '',
    tipo: 'outros' as Meta['tipo'],
    cor: '#3b82f6',
    icone: '🎯',
    dataLimite: '',
    descricao: ''
  });

  const tiposMeta = [
    { value: 'viagem', label: 'Viagem', icon: '✈️' },
    { value: 'casa', label: 'Casa', icon: '🏠' },
    { value: 'investimentos', label: 'Investimentos', icon: '📊' },
    { value: 'emergencia', label: 'Emergência', icon: '💵' },
    { value: 'outros', label: 'Outros', icon: '🎯' }
  ];

  const coresDisponiveis = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#6b7280'
  ];

  const iconesDisponiveis = [
    '🎯', '✈️', '🏠', '📊', '💵', '🚗', '💰', '📱', 
    '💻', '🎮', '📚', '🏆', '💎', '⚽', '🎸', '🏋️'
  ];

  useEffect(() => {
    if (editingMeta) {
      setFormData({
        nome: editingMeta.nome,
        valorMeta: editingMeta.valorMeta.toString(),
        valorAtual: editingMeta.valorAtual.toString(),
        tipo: editingMeta.tipo,
        cor: editingMeta.cor,
        icone: editingMeta.icone,
        dataLimite: editingMeta.dataLimite 
          ? editingMeta.dataLimite.toISOString().split('T')[0] 
          : '',
        descricao: editingMeta.descricao || ''
      });
    } else {
      resetForm();
    }
  }, [editingMeta, visible]);

  const resetForm = () => {
    setFormData({
      nome: '',
      valorMeta: '',
      valorAtual: '0',
      tipo: 'outros',
      cor: '#3b82f6',
      icone: '🎯',
      dataLimite: '',
      descricao: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome da meta é obrigatório');
      return;
    }

    if (!formData.valorMeta || parseFloat(formData.valorMeta) <= 0) {
      Alert.alert('Erro', 'Valor da meta deve ser maior que zero');
      return;
    }

    const valorAtual = parseFloat(formData.valorAtual) || 0;
    const valorMeta = parseFloat(formData.valorMeta);

    if (valorAtual < 0) {
      Alert.alert('Erro', 'Valor atual não pode ser negativo');
      return;
    }

    const novaMeta: Omit<Meta, 'id'> = {
      nome: formData.nome.trim(),
      valorAtual,
      valorMeta,
      tipo: formData.tipo,
      cor: formData.cor,
      icone: formData.icone,
      dataInicio: editingMeta?.dataInicio || new Date(),
      dataLimite: formData.dataLimite ? new Date(formData.dataLimite) : undefined,
      descricao: formData.descricao.trim() || undefined,
      finalizada: valorAtual >= valorMeta
    };

    onSave(novaMeta);
    handleClose();
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
              {editingMeta ? 'Editar Meta' : 'Nova Meta Financeira'}
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
            {/* Nome da Meta */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nome da Meta *
              </Text>
              <TextInput
                className={`border rounded-lg p-3 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Ex: Viagem para Europa"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={formData.nome}
                onChangeText={(text) => setFormData({...formData, nome: text})}
              />
            </View>

            {/* Tipo da Meta */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo da Meta
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {tiposMeta.map((tipo) => (
                    <TouchableOpacity
                      key={tipo.value}
                      onPress={() => setFormData({
                        ...formData, 
                        tipo: tipo.value as Meta['tipo'],
                        icone: tipo.icon
                      })}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.tipo === tipo.value
                          ? 'bg-blue-500 border-blue-500'
                          : (isDark ? 'border-gray-600' : 'border-gray-300')
                      }`}
                    >
                      <Text className={`text-center ${
                        formData.tipo === tipo.value
                          ? 'text-white'
                          : (isDark ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        {tipo.icon} {tipo.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Valores */}
            <View className="flex-row space-x-4 mb-4">
              <View className="flex-1">
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Valor da Meta *
                </Text>
                <TextInput
                  className={`border rounded-lg p-3 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0,00"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={formData.valorMeta}
                  onChangeText={(text) => setFormData({...formData, valorMeta: text})}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Valor Atual
                </Text>
                <TextInput
                  className={`border rounded-lg p-3 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0,00"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={formData.valorAtual}
                  onChangeText={(text) => setFormData({...formData, valorAtual: text})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Data Limite */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Data Limite (Opcional)
              </Text>
              <TextInput
                className={`border rounded-lg p-3 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={formData.dataLimite}
                onChangeText={(text) => setFormData({...formData, dataLimite: text})}
              />
            </View>

            {/* Cor */}
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cor
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {coresDisponiveis.map((cor) => (
                    <TouchableOpacity
                      key={cor}
                      onPress={() => setFormData({...formData, cor})}
                      className={`w-10 h-10 rounded-full border-2 ${
                        formData.cor === cor ? 'border-gray-400' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Ícone */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ícone
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {iconesDisponiveis.map((icone) => (
                    <TouchableOpacity
                      key={icone}
                      onPress={() => setFormData({...formData, icone})}
                      className={`w-10 h-10 rounded-lg items-center justify-center border ${
                        formData.icone === icone
                          ? 'bg-blue-500 border-blue-500'
                          : (isDark ? 'border-gray-600' : 'border-gray-300')
                      }`}
                    >
                      <Text className="text-lg">{icone}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

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
              onPress={handleSave}
              className="flex-1 py-3 rounded-lg bg-blue-600"
            >
              <Text className="text-center font-medium text-white">
                {editingMeta ? 'Atualizar' : 'Criar Meta'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMetaModal; 