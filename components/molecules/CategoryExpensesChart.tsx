import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useScreenSize } from '../../hooks/useScreenSize';
import { CategoryExpense } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface CategoryExpensesChartProps {
  data: CategoryExpense[];
}

const CategoryExpensesChart: React.FC<CategoryExpensesChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(0);

  // Nome do mês atual
  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  // Converte os dados para o formato da biblioteca
  const pieData = data.map((item) => {
    // Garantir valor numérico
    const pct = item.percentage ?? 0;
    // Formatar com duas casas decimais
    const formatted = pct.toFixed(2);

    return {
      value: pct,
      color: item.color,
      gradientCenterColor: item.color,
      focused: false,
      text: `${formatted}%`,
      textColor: isDark ? '#FFFFFF' : '#000000',
      textSize: 14,
      fontWeight: 'bold',
    };
  });

  // Calcula o raio baseado no container e responsividade
  const calculateRadius = () => {
    if (containerWidth <= 0) return isMobile ? 60 : 80;
    const baseRadius = Math.min(containerWidth * 0.25, 100);
    return isMobile ? Math.min(baseRadius, 100) : baseRadius;
  };

  const radius = calculateRadius();
  
  // Altura fixa para mobile
  const cardHeight = isMobile ? 360 : undefined;

  return (
    <Card 
      className="p-4 h-full" 
      style={cardHeight ? { height: cardHeight } : { minHeight: 400 }}
    >
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Gastos por Categoria - {currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)}
      </Text>
      
      <View 
        className={`${isMobile ? 'flex-1' : 'flex-1'} items-center justify-center`}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {containerWidth > 0 && (
          <>
            {/* Gráfico de Donut */}
            <View className={isMobile ? 'mb-4' : 'mb-6'}>
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
                textSize={isMobile ? 10 : 12}
                labelsPosition="mid"
                strokeColor={isDark ? '#374151' : '#F3F4F6'}
                strokeWidth={2}
              />
            </View>

            {/* Legenda */}
            <View className={`w-full`}>
              {data.map((item, index) => {
                const pct = item.percentage ?? 0;
                const formatted = pct.toFixed(2);
                return (
                  <View 
                    key={index} 
                    className={`flex-row items-center justify-between ${
                      index > 0 ? (isMobile ? 'mt-2' : 'mt-3') : ''
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className={`
                        flex-1 font-medium ${isMobile ? 'text-sm' : ''}
                        ${isDark ? 'text-white' : 'text-gray-900'}
                      `}>
                        {item.name}
                      </Text>
                    </View>
                    
                    <Text className={`
                      font-semibold ${isMobile ? 'text-sm' : ''}
                      ${isDark ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      {formatted}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
    </Card>
  );
};

export default CategoryExpensesChart;
