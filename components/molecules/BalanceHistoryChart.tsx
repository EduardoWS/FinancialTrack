import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { BalanceHistory } from '../../data/mockData';
import { useScreenSize } from '../../hooks/useScreenSize';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface BalanceHistoryChartProps {
  data: BalanceHistory[];
}

const getLastMonths = (numberOfMonths: number) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const today = new Date();
  const result = [];
  for (let i = numberOfMonths - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      label: months[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth() + 1
    });
  }
  return result;
};

const BalanceHistoryChart: React.FC<BalanceHistoryChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const { isMobile, width: screenWidth } = useScreenSize();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(0);

  const numberOfMonths = isMobile ? 10 : 12;
  const chartTitle = `Histórico de Saldo - Últimos ${numberOfMonths} meses`;

  const monthLabels = getLastMonths(numberOfMonths);

  const chartData = monthLabels.map(labelInfo => {
    const dataPoint = data.find(d => d.month === labelInfo.label);
    const value = dataPoint?.balance;
    return {
      value: value,
      label: labelInfo.label,
      dataPointText: value !== undefined ? formatCurrency(value) : '',
    };
  }).filter(item => item.value !== undefined);

  const values = chartData.map(item => item.value).filter(v => v !== undefined) as number[];
  let yAxisProps = {};

  if (values.length > 1) {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const padding = range > 0 ? range * 0.1 : 50;

    const yAxisOffset = Math.floor((minValue - padding) / 50) * 40;
    const newMaxValue = Math.ceil((maxValue + padding) / 50) * 40;

    yAxisProps = {
      yAxisOffset: yAxisOffset,
      maxValue: newMaxValue,
      formatYLabel: (label: string) => `${Math.round(parseFloat(label))}`,
    };
  }

  const getChartSpacing = () => {
    const numPoints = chartData.length;
    let availableWidth = containerWidth - 40;

    if (isMobile) {
      availableWidth = screenWidth - 80;
    }
    
    if (availableWidth <= 0) return 25;

    const spacing = availableWidth / (numPoints);
    return Math.max(25, spacing);
  };

  const spacing = getChartSpacing();
  
  const cardHeight = isMobile ? 320 : undefined;
  const chartHeight = isMobile ? 220 : 300;

  return (
    <Card 
      className="p-4 h-full" 
      style={cardHeight ? { height: cardHeight } : {}}
    >
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {chartTitle}
      </Text>
      <View 
        className={isMobile ? '' : 'flex-1'}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {(containerWidth > 0 || isMobile) && (
          <View style={{ overflow: 'hidden' }}>
            <LineChart
              data={chartData}
              height={chartHeight}
              thickness={isMobile ? 2 : 2}
              {...yAxisProps}
              color={isDark ? "#3B82F6" : "#60A5FA"}
              areaChart
              startFillColor={isDark ? "rgb(59, 130, 246)" : "rgb(96, 165, 250)"}
              endFillColor={isDark ? "rgb(37, 82, 155)" : "rgb(60, 105, 160)"}
              startOpacity={0.3}
              endOpacity={0.1}
              dataPointsColor={isDark ? "#3B82F6" : "#60A5FA"}
              dataPointsRadius={isMobile ? 3 : 4}
              spacing={spacing}
              rulesColor={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}
              yAxisThickness={0}
              hideYAxisText
              hideRules
              xAxisLabelTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
              endSpacing={10}
              isAnimated={true}
              textShiftY={isMobile ? -8 : -12}
              textShiftX={isMobile ? -14 : -16}
              textColor1={isDark ? '#dddddd' : '#222222'}
              textFontSize1={isMobile ? 9 : 11}
              
            />
          </View>
        )}
      </View>
    </Card>
  );
};

export default BalanceHistoryChart; 