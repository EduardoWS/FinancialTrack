import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { WeeklyActivity } from '../../data/mockData';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface WeeklyActivityChartProps {
  data: WeeklyActivity[];
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(0);

  const barData = data.map(item => ({
    stacks: [
      { value: item.income, color: '#34D399' }, // Verde para renda
      { value: item.expense, color: '#F87171' }, // Vermelho para despesa
    ],
    label: item.day,
  }));

  // Calcula dimensões dinamicamente baseado no container
  const calculateDimensions = () => {
    if (containerWidth <= 0) {
      return { spacing: 30, barWidth: 25, initialSpacing: 15, endSpacing: 15 };
    }
    
    const numBars = data.length;
    const availableWidth = containerWidth - 40; // Margem para labels e eixos
    const totalSpacing = availableWidth * 0.6; // 60% para espaçamentos
    const totalBarWidth = availableWidth * 0.4; // 40% para as barras
    
    const spacing = Math.max(20, totalSpacing / (numBars + 1));
    const barWidth = Math.max(20, totalBarWidth / numBars);
    const initialSpacing = spacing * 0.4;
    const endSpacing = spacing * 0.6;
    
    return { spacing, barWidth, initialSpacing, endSpacing };
  };

  const { spacing, barWidth, initialSpacing, endSpacing } = calculateDimensions();
  
  // Altura fixa para mobile, responsiva para desktop
  const cardHeight = isMobile ? 350 : undefined;
  const chartHeight = isMobile ? 220 : 250;

  return (
    <Card 
      className="p-4 h-full" 
      style={cardHeight ? { height: cardHeight } : {}}
    >
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Atividade Semanal
      </Text>
      <View 
        className={isMobile ? '' : 'flex-1'}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {containerWidth > 0 && (
          <BarChart
            stackData={barData}
            height={chartHeight}
            spacing={spacing}
            barWidth={barWidth}
            initialSpacing={initialSpacing}
            endSpacing={endSpacing}
            maxValue={800}
            yAxisTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
            xAxisLabelTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
            noOfSections={4}
            rulesColor={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}
            isAnimated
            showReferenceLine1={false}
            showReferenceLine2={false}
            showReferenceLine3={false}
            disableScroll={true}
          />
        )}
        <View className="flex-row justify-center mt-4">
            <View className="flex-row items-center mr-6">
                <View className="w-3 h-3 rounded-full bg-[#34D399] mr-2" />
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Receitas</Text>
            </View>
            <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-[#F87171] mr-2" />
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Despesas</Text>
            </View>
        </View>
      </View>
    </Card>
  );
};

export default WeeklyActivityChart;
