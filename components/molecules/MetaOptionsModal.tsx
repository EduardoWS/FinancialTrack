import React from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Meta } from '../../hooks/useMetas';
import { useTheme } from '../../services/ThemeContext';

interface MetaOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  meta: Meta | null;
  isActive: boolean;
  onAddValor: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  progresso
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;

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
          }}
        >
          {/* Header com informações da meta */}
          <View className="p-6 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-3">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${meta.cor}20` }}
              >
                <Text className="text-xl">{meta.icone}</Text>
              </View>
              <View>
                <Text className={`font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {meta.nome}
                </Text>
                <Text className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Progresso: {Math.round(progresso)}%
                </Text>
              </View>
            </View>
            
            {isActive ? (
              <Text className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                O que deseja fazer com esta meta?
              </Text>
            ) : (
              <Text className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Meta concluída em {meta.dataLimite?.toLocaleDateString('pt-BR') || 'data não informada'}
              </Text>
            )}
          </View>

          {/* Opções */}
          <View className="p-4">
            {isActive && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onAddValor();
                    onClose();
                  }}
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
                  onPress={() => {
                    onEdit();
                    onClose();
                  }}
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
                      Alterar detalhes da meta
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                onDelete();
                onClose();
              }}
              className={`
                p-4 rounded-lg mb-3 flex-row items-center
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

          {/* Footer */}
          <View className="p-4 border-t border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={onClose}
              className={`
                py-3 rounded-lg border-2
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
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MetaOptionsModal; 