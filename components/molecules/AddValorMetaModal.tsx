import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../../services/dashboardService';
import { Meta } from '../../services/metasService';
import { useTheme } from '../../services/ThemeContext';

interface AddValorMetaModalProps {
  visible: boolean;
  onClose: () => void;
  onAddValor: (valor: number) => void;
  meta: Meta | null;
}

const AddValorMetaModal: React.FC<AddValorMetaModalProps> = ({ 
  visible, 
  onClose, 
  onAddValor, 
  meta 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [valor, setValor] = useState('');

  useEffect(() => {
    console.log('AddValorMetaModal - visible:', visible, 'meta:', meta?.nome || 'null');
  }, [visible, meta]);

  const handleClose = () => {
    setValor('');
    onClose();
  };

  const handleAddValor = () => {
    const valorNumerico = parseFloat(valor);
    
    if (!valor || valorNumerico <= 0) {
      Alert.alert('Erro', 'Digite um valor válido maior que zero');
      return;
    }

    if (!meta) {
      Alert.alert('Erro', 'Meta não encontrada');
      return;
    }

    onAddValor(valorNumerico);
    handleClose();
  };

  const valorRestante = meta ? meta.valorMeta - meta.valorAtual : 0;
  const progresso = meta ? Math.min((meta.valorAtual / meta.valorMeta) * 100, 100) : 0;

  if (!visible) return null;

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
            rounded-2xl shadow-2xl
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}
          style={{
            width: Math.min(screenWidth * 0.9, 400),
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
              Adicionar Valor à Meta
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
            className="px-6 py-4"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenHeight * 0.8 - 160 }}
          >
            {meta ? (
              <>
                {/* Informações da Meta */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${meta.cor}20` }}
                    >
                      <Text className="text-xl">{meta.icone}</Text>
                    </View>
                    <View>
                      <Text className={`font-semibold text-base ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {meta.nome}
                      </Text>
                      <Text className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valorMeta)}
                      </Text>
                    </View>
                  </View>

                  {/* Barra de progresso */}
                  <View className={`h-2 rounded-full mb-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <View 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${progresso}%`,
                        backgroundColor: meta.cor
                      }}
                    />
                  </View>

                  <View className="flex-row justify-between">
                    <Text className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Progresso: {Math.round(progresso)}%
                    </Text>
                    <Text className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Faltam: {formatCurrency(valorRestante)}
                    </Text>
                  </View>
                </View>

                {/* Input do valor */}
                <View className="mb-6">
                  <Text className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Valor a adicionar
                  </Text>
                  <TextInput
                    className={`border rounded-lg p-4 text-lg font-semibold ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="0,00"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={valor ? formatCurrency(parseFloat(valor) || 0).replace('R$', '').trim() : ''}
                    onChangeText={(text) => {
                      // Remove formatação e mantém apenas números e vírgula/ponto
                      const numericText = text.replace(/[^\d,]/g, '').replace(',', '.');
                      setValor(numericText);
                    }}
                    keyboardType="numeric"
                    autoFocus
                  />
                  
                  {/* Sugestões de valores */}
                  <View className="flex-row justify-between mt-3">
                    {[100, 500, 1000].map((sugestao) => (
                      <TouchableOpacity
                        key={sugestao}
                        onPress={() => {
                          const valorAtual = parseFloat(valor) || 0;
                          const novoValor = valorAtual + sugestao;
                          setValor(novoValor.toString());
                        }}
                        className={`px-4 py-2 rounded-lg border-2 active:scale-95 transition-transform ${
                          isDark 
                            ? 'border-blue-500 bg-black/20 bg-opacity-10' 
                            : 'border-blue-500 bg-blue-50'
                        }`}
                        activeOpacity={0.8}
                      >
                        <Text className={`text-sm font-semibold ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          +{formatCurrency(sugestao)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              /* Fallback se meta for null */
              <View className="mb-6 items-center py-8">
                <Text className={`text-lg ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Carregando informações da meta...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer com botões */}
          <View className={`
            p-6 border-t flex-row
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <TouchableOpacity
              onPress={handleClose}
              className={`
                flex-1 py-3 rounded-lg border-2 mr-4
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
              onPress={handleAddValor}
              className="flex-1 py-3 rounded-lg"
              style={{ backgroundColor: meta?.cor || '#3b82f6' }}
              disabled={!meta}
            >
              <Text className={`text-center font-medium ${
                meta ? 'text-white' : 'text-gray-400'
              }`}>
                Adicionar Valor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddValorMetaModal; 