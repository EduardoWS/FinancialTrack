import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Meta } from '../../services/metasService';
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
  const isWeb = Platform.OS === 'web';
  const isMobile = screenWidth < 768;

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
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280',
    '#F97316', '#84CC16', '#14B8A6', '#6366F1'
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
      valorAtual: '',
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
            {editingMeta ? 'Editar Meta' : 'Nova Meta'}
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
            className="flex-1 py-4 rounded-xl bg-blue-600"
          >
            <Text className="text-center font-semibold text-base text-white">
              {editingMeta ? 'Atualizar' : 'Criar'}
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
          width: Math.min(screenWidth * 0.85, 900),
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
            {editingMeta ? 'Editar Meta Financeira' : 'Nova Meta Financeira'}
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

        {/* Content in grid layout for web */}
        <ScrollView 
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>

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
            className="px-8 py-3 rounded-xl bg-blue-600"
          >
            <Text className="text-white font-semibold text-base">
              {editingMeta ? 'Atualizar Meta' : 'Criar Meta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContent = () => (
    <View className={isWeb && !isMobile ? "flex-row space-x-8" : ""}>
      {/* Coluna 1 - Informações básicas */}
      <View className={isWeb && !isMobile ? "flex-1" : ""}>
        {/* Nome da Meta */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Nome da Meta *
          </Text>
          <TextInput
            className={`border rounded-xl p-4 text-base ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
            placeholder="Ex: Viagem para Europa"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.nome}
            onChangeText={(text) => setFormData({...formData, nome: text})}
          />
        </View>

        {/* Tipo da Meta */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Tipo da Meta
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {tiposMeta.map((tipo) => (
              <TouchableOpacity
                key={tipo.value}
                onPress={() => setFormData({
                  ...formData, 
                  tipo: tipo.value as Meta['tipo'],
                  icone: tipo.icon
                })}
                className={`
                  flex-row items-center px-4 py-3 rounded-xl border-2
                  ${formData.tipo === tipo.value
                    ? 'border-blue-500 bg-blue-500/20'
                    : (isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50')
                  }
                `}
              >
                <Text className="text-lg mr-2">{tipo.icon}</Text>
                <Text className={`text-sm font-medium ${
                  formData.tipo === tipo.value
                    ? 'text-blue-600'
                    : (isDark ? 'text-gray-300' : 'text-gray-700')
                }`}>
                  {tipo.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Valores */}
        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1">
            <Text className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Valor da Meta *
            </Text>
            <TextInput
              className={`border rounded-xl p-4 text-base ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="0,00"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={formData.valorMeta}
              onChangeText={(text) => setFormData({...formData, valorMeta: text})}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <Text className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Valor Atual
            </Text>
            <TextInput
              className={`border rounded-xl p-4 text-base ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
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
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Data Limite (Opcional)
          </Text>
          <TextInput
            className={`border rounded-xl p-4 text-base ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.dataLimite}
            onChangeText={(text) => setFormData({...formData, dataLimite: text})}
          />
        </View>
      </View>

      {/* Coluna 2 - Personalização */}
      <View className={isWeb && !isMobile ? "flex-1" : ""}>
        {/* Cor */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Cor da Meta
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {coresDisponiveis.map((cor) => (
              <TouchableOpacity
                key={cor}
                onPress={() => setFormData({...formData, cor})}
                className={`
                  w-12 h-12 rounded-xl border-4 items-center justify-center
                  ${formData.cor === cor ? 'border-gray-800' : 'border-transparent'}
                `}
                style={{ backgroundColor: cor }}
              >
                {formData.cor === cor && (
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
            Ícone da Meta
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {iconesDisponiveis.map((icone) => (
              <TouchableOpacity
                key={icone}
                onPress={() => setFormData({...formData, icone})}
                className={`
                  w-12 h-12 rounded-xl items-center justify-center border-2
                  ${formData.icone === icone
                    ? (isDark ? 'border-blue-500 bg-blue-500/20' : 'border-blue-500 bg-blue-50')
                    : (isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50')
                  }
                `}
              >
                <Text className="text-xl">{icone}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descrição */}
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Descrição (Opcional)
          </Text>
          <TextInput
            className={`border rounded-xl p-4 text-base h-24 ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
            placeholder="Descreva sua meta..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={formData.descricao}
            onChangeText={(text) => setFormData({...formData, descricao: text})}
            multiline
            textAlignVertical="top"
          />
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

export default AddMetaModal; 