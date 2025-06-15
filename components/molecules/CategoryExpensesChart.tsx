import React from 'react';
import { Text, View } from 'react-native';
import { CategoryExpense } from '../../data/mockData';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface CategoryExpensesChartProps {
  data: CategoryExpense[];
}

const CategoryExpensesChart: React.FC<CategoryExpensesChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calcula ângulos para cada categoria
  let currentAngle = 0;
  const segments = data.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      angle
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <Card className="min-h-[400px]">
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Gastos por Categorias
      </Text>
      
      <View className="items-center">
        {/* Gráfico de rosca simulado */}
        <View className="relative w-32 h-32 mb-6">
          {/* Círculo de fundo */}
          <View className={`
            absolute inset-0 rounded-full border-8
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `} />
          
          {/* Segmentos coloridos */}
          {segments.map((segment, index) => (
            <View
              key={index}
              className="absolute inset-0 rounded-full"
              style={{
                borderWidth: 8,
                borderColor: segment.color,
                transform: [
                  { rotate: `${segment.startAngle}deg` }
                ],
                // Simula um arco usando border parcial
                borderTopColor: segment.color,
                borderRightColor: segment.angle > 90 ? segment.color : 'transparent',
                borderBottomColor: segment.angle > 180 ? segment.color : 'transparent',
                borderLeftColor: segment.angle > 270 ? segment.color : 'transparent',
              }}
            />
          ))}
          
          {/* Círculo central para criar efeito de rosca */}
          <View className={`
            absolute inset-4 rounded-full
            ${isDark ? 'bg-gray-800' : 'bg-white'}
          `} />
        </View>

        {/* Legenda */}
        <View className="w-full space-y-3">
          {data.map((item, index) => (
            <View key={index} className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                />
                <Text className={`
                  flex-1 font-medium
                  ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  {item.category}
                </Text>
              </View>
              
              <Text className={`
                font-semibold
                ${isDark ? 'text-gray-300' : 'text-gray-700'}
              `}>
                {item.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default CategoryExpensesChart; 