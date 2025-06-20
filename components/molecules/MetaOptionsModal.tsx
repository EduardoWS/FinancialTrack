import { Ionicons } from '@expo/vector-icons';
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
  const isMobile = screenWidth < 768;

  if (!meta) return null;

  const OptionButton = ({
    onPress,
    iconName,
    title,
    subtitle,
    color,
  }: {
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: 'green' | 'yellow' | 'blue' | 'red';
  }) => {
    const themeColors = {
      green: { light: '#16a34a', dark: '#4ade80' },
      yellow: { light: '#f59e0b', dark: '#facc15' },
      blue: { light: '#2563eb', dark: '#60a5fa' },
      red: { light: '#dc2626', dark: '#f87171' },
    };

    const subtextColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const bgColor = isDark ? 'bg-gray-700' : 'bg-gray-100';
    
    const iconColorValue = isDark ? themeColors[color].dark : themeColors[color].light;
    const textColorClass = {
      green: isDark ? 'text-green-400' : 'text-green-600',
      yellow: isDark ? 'text-yellow-400' : 'text-yellow-600',
      blue: isDark ? 'text-blue-400' : 'text-blue-600',
      red: isDark ? 'text-red-400' : 'text-red-600',
    }[color];

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`p-4 rounded-lg flex-row items-center ${bgColor} ${isMobile ? 'mb-3' : 'w-[48%]'}`}
      >
        <Ionicons name={iconName} size={24} color={iconColorValue} style={{ marginRight: 16 }} />
        <View>
          <Text className={`font-medium ${textColorClass}`}>{title}</Text>
          <Text className={`text-xs ${subtextColor}`}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View className={`items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <View 
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: `${meta.cor}20` }}
      >
        <Text className="text-2xl">{meta.icone}</Text>
      </View>
      <Text className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {meta.nome}
      </Text>
      <View className={`px-3 py-1 rounded-full ${isActive ? 'bg-blue-100' : 'bg-green-100'}`}>
        <Text className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-green-700'}`}>
          {isActive ? 'Ativa' : 'Finalizada'} • {Math.round(progresso)}%
        </Text>
      </View>
    </View>
  );

  const renderOptions = () => (
    <View className={`p-4 ${!isMobile ? 'flex-row flex-wrap justify-between gap-y-3' : ''}`}>
      {isActive && (
        <>
          <OptionButton
            onPress={onAddValor}
            iconName="wallet-outline"
            title="Adicionar Valor"
            subtitle="Contribuir para esta meta"
            color="green"
          />
          <OptionButton
            onPress={onFinalizar}
            iconName="trophy-outline"
            title="Finalizar Meta"
            subtitle="Marcar como concluída"
            color="yellow"
          />
          {!isMobile && <View className="w-full h-px my-1 bg-transparent" />}
        </>
      )}
      <OptionButton
        onPress={onEdit}
        iconName="pencil-outline"
        title="Editar Meta"
        subtitle="Alterar nome, valor, etc."
        color="blue"
      />
      <OptionButton
        onPress={onDelete}
        iconName="trash-outline"
        title="Excluir Meta"
        subtitle="Remover permanentemente"
        color="red"
      />
    </View>
  );

  const renderMobileModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-end">
      <View className={`rounded-t-3xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {renderHeader()}
        <ScrollView style={{ maxHeight: screenHeight * 0.6 }}>
          {renderOptions()}
        </ScrollView>
        <View className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <TouchableOpacity
            onPress={onClose}
            className={`p-3 rounded-lg border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
          >
            <Text className={`text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderWebModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
      <View 
        className={`rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        style={{ width: Math.min(screenWidth * 0.9, 500) }}
      >
        {renderHeader()}
        {renderOptions()}
        <View className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} items-end`}>
          <TouchableOpacity
            onPress={onClose}
            className={`px-6 py-2 rounded-lg border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
          >
            <Text className={`text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={isMobile ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      {isMobile ? renderMobileModal() : renderWebModal()}
    </Modal>
  );
};

export default MetaOptionsModal; 