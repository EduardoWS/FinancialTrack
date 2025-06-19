import React from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Meta } from '../../services/metasService';
import { useTheme } from '../../services/ThemeContext';

interface MetaOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  meta: Meta | null;
  isActive: boolean;
  onAddValor: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFinalizar: () => void;
  progresso: number;
}

const MetaOptionsModal: React.FC<MetaOptionsModalProps> = ({
  visible,
  onClose,
  meta,
  isActive,
  onAddValor,
  onEdit,
  onDelete,
  onFinalizar,
  progresso,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  if (!meta) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Fundo desfocado */}
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
        {/* Container do modal */}
        <View 
          className={`
            rounded-2xl shadow-2xl
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `}
          style={{
            width: Math.min(screenWidth * 0.9, 350),
            maxHeight: screenHeight * 0.8
          }}
        >
          {/* Header com informações da meta */}
          <View className={`
            items-center p-6 border-b
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <View 
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${meta.cor}20` }}
            >
              <Text className="text-2xl">{meta.icone}</Text>
            </View>
            <Text className={`text-lg font-bold text-center mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {meta.nome}
            </Text>
            <View className={`px-3 py-1 rounded-full ${
              isActive ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Text className={`text-sm font-medium ${
                isActive ? 'text-blue-700' : 'text-green-700'
              }`}>
                {isActive ? 'Ativa' : 'Finalizada'} • {Math.round(progresso)}%
              </Text>
            </View>
          </View>

          {/* Lista de opções */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenHeight * 0.8 - 200 }}
          >
            <View className="p-4">
              {isActive && (
                <>
                  <TouchableOpacity
                    onPress={onAddValor}
                    className={`
                      p-4 rounded-lg mb-3 flex-row items-center
                      ${isDark ? 'bg-green-100/10 border border-green-500' : 'bg-green-50 border border-green-200'}
                    `}
                  >
                    <Text className="text-2xl mr-3">💰</Text>
                    <View>
                      <Text className={`font-medium ${
                        isDark ? 'text-green-400' : 'text-green-700'
                      }`}>
                        Adicionar Valor
                      </Text>
                      <Text className={`text-xs ${
                        isDark ? 'text-green-300' : 'text-green-600'
                      }`}>
                        Contribuir para esta meta
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onFinalizar}
                    className={`
                      p-4 rounded-lg mb-3 flex-row items-center
                      ${isDark ? 'bg-yellow-100/10 border border-yellow-500' : 'bg-yellow-50 border border-yellow-200'}
                    `}
                  >
                    <Text className="text-2xl mr-3">🏆</Text>
                    <View>
                      <Text className={`font-medium ${
                        isDark ? 'text-yellow-400' : 'text-yellow-700'
                      }`}>
                        Finalizar Meta
                      </Text>
                      <Text className={`text-xs ${
                        isDark ? 'text-yellow-300' : 'text-yellow-600'
                      }`}>
                        Marcar como concluída
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View className={`h-px mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </>
              )}

              <TouchableOpacity
                onPress={onEdit}
                className={`
                  p-4 rounded-lg mb-3 flex-row items-center
                  ${isDark ? 'bg-blue-100/10 border border-blue-500' : 'bg-blue-50 border border-blue-200'}
                `}
              >
                <Text className="text-2xl mr-3">✏️</Text>
                <View>
                  <Text className={`font-medium ${
                    isDark ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    Editar Meta
                  </Text>
                  <Text className={`text-xs ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Alterar nome, valor, etc.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onDelete}
                className={`
                  p-4 rounded-lg flex-row items-center
                  ${isDark ? 'bg-red-100/10 border border-red-500' : 'bg-red-50 border border-red-200'}
                `}
              >
                <Text className="text-2xl mr-3">🗑️</Text>
                <View>
                  <Text className={`font-medium ${
                    isDark ? 'text-red-400' : 'text-red-700'
                  }`}>
                    Excluir Meta
                  </Text>
                  <Text className={`text-xs ${
                    isDark ? 'text-red-300' : 'text-red-600'
                  }`}>
                    Remover permanentemente
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className={`
            p-4 border-t
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <TouchableOpacity
              onPress={onClose}
              className={`
                p-3 rounded-lg border-2
                ${isDark ? 'border-gray-600' : 'border-gray-300'}
              `}
            >
              <Text className={`
                text-center font-medium
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MetaOptionsModal; 