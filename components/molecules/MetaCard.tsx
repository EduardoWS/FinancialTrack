import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Meta } from '../../hooks/useMetas';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';

interface MetaCardProps {
  meta: Meta;
  onPress?: () => void;
  progresso: number;
}

const MetaCard: React.FC<MetaCardProps> = ({ meta, onPress, progresso }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getProgressColor = (progresso: number): string => {
    if (progresso >= 100) return '#10b981'; // Verde para concluída
    if (progresso >= 70) return '#f59e0b'; // Amarelo para quase lá
    return meta.cor; // Cor original da meta
  };

  const progressColor = getProgressColor(progresso);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`p-4 rounded-xl mb-4 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
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
        <View className="items-end">
          <Text 
            className="text-lg font-bold"
            style={{ color: progressColor }}
          >
            {Math.round(progresso)}%
          </Text>
          {meta.finalizada && (
            <Text className="text-xs text-green-600 font-medium">
              Finalizada
            </Text>
          )}
        </View>
      </View>

      {/* Barra de progresso */}
      <View className={`h-2 rounded-full ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <View 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min(progresso, 100)}%`,
            backgroundColor: progressColor
          }}
        />
      </View>

      {/* Data limite se existir */}
      {meta.dataLimite && !meta.finalizada && (
        <View className="mt-2">
          <Text className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Meta até: {meta.dataLimite.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MetaCard; 