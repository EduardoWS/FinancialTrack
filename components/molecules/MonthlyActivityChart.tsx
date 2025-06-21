import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface MonthlyActivity {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyActivityChartProps {
  data: MonthlyActivity[];
}

const MonthlyActivityChart: React.FC<MonthlyActivityChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(0);

  const barData = data.flatMap(item => [
    {
      value: item.income,
      label: item.month,
      labelTextStyle: { color: isDark ? '#A0AEC0' : '#718096', fontSize: 10 },
      labelWidth: isMobile ? 20 : 36, // garante espaço suficiente para a abreviação do mês
      spacing: 2, // pequeno espaço entre as barras do mesmo mês
      frontColor: '#34D399',
    },
    {
      value: item.expense,
      frontColor: '#F87171',
    },
  ]);

  // Valor máximo dinâmico (com padding de 10%)
  const rawMax = Math.max(...data.flatMap(d => [d.income, d.expense]));
  const maxValue = rawMax > 0 ? Math.ceil(rawMax * 1.1) : 100; // fallback 100

  // Calcula dimensões dinamicamente baseado no container
  const calculateDimensions = () => {
    if (containerWidth <= 0) {
      // valores default (mantêm altura/largura anteriores)
      return { spacing: 30, barWidth: 12, initialSpacing: 15, endSpacing: 15 };
    }

    const numGroups = data.length; // dias
    const barsPerGroup = 2; // receita + despesa
    const totalBars = numGroups * barsPerGroup;

    const availableWidth = containerWidth - 40; // Margem para labels e eixos
    const totalSpacing = availableWidth * 0.6; // 60% para espaçamentos entre grupos
    const totalBarWidth = availableWidth * 0.4; // 40% para as barras

    const spacing = Math.max(20, totalSpacing / (numGroups + 1));
    const barWidth = Math.max(6, totalBarWidth / totalBars);
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
      className="pt-4 h-full" 
      style={cardHeight ? { height: cardHeight } : {}}
    >
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Atividade – últimos 6 meses
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
            data={barData}
            height={chartHeight}
            spacing={spacing}
            barWidth={barWidth}
            initialSpacing={initialSpacing}
            endSpacing={endSpacing}
            maxValue={maxValue}
            yAxisTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
            xAxisLabelTextStyle={{ color: isDark ? '#A0AEC0' : '#718096', fontSize: 10 }}
            noOfSections={4}
            rulesColor={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}
            isAnimated
            roundedTop
            roundedBottom
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

export default MonthlyActivityChart;
