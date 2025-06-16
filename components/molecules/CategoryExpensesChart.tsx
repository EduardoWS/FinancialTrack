import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CategoryExpense } from '../../data/mockData';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface CategoryExpensesChartProps {
  data: CategoryExpense[];
}

const CategoryExpensesChart: React.FC<CategoryExpensesChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(0);

  // Converte os dados para o formato da biblioteca
  const pieData = data.map((item) => ({
    value: item.percentage,
    color: item.color,
    gradientCenterColor: item.color,
    focused: false,
    text: `${item.percentage}%`,
    textColor: isDark ? '#FFFFFF' : '#000000',
    textSize: 14,
    fontWeight: 'bold',
  }));

  // Calcula o raio baseado no container
  const calculateRadius = () => {
    if (containerWidth <= 0) return 80;
    return Math.min(containerWidth * 0.25, 100);
  };

  const radius = calculateRadius();

  return (
    <Card className="min-h-[400px] p-4">
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Gastos por Categorias
      </Text>
      
      <View 
        className="flex-1 items-center justify-center"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {containerWidth > 0 && (
          <>
            {/* Gráfico de Donut */}
            <View className="mb-6">
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                radius={radius}
                innerRadius={radius * 0.6}
                innerCircleColor={isDark ? '#1F2937' : '#FFFFFF'}
                focusOnPress
                showValuesAsLabels={false}
                textSize={12}
                labelsPosition="mid"
                strokeColor={isDark ? '#374151' : '#F3F4F6'}
                strokeWidth={2}
              />
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
          </>
        )}
      </View>
    </Card>
  );
};

export default CategoryExpensesChart; 