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
  
  // Função para calcular um "nice number" (número arredondado agradável)
  const getNiceNumber = (value: number, round: boolean = false): number => {
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const fraction = Math.abs(value) / Math.pow(10, exponent);
    let niceFraction: number;

    if (round) {
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
    } else {
      if (fraction <= 1) niceFraction = 1;
      else if (fraction <= 2) niceFraction = 2;
      else if (fraction <= 5) niceFraction = 5;
      else niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent) * (value < 0 ? -1 : 1);
  };

  let yAxisProps = {};

  if (values.length > 1) {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Se todos os valores são iguais, criar uma escala artificial
    if (minValue === maxValue) {
      const baseValue = minValue === 0 ? 100 : Math.abs(minValue);
      const padding = baseValue * 0.2;
      
      yAxisProps = {
        yAxisOffset: minValue - padding,
        maxValue: maxValue + padding,
        noOfSections: 4,
      };
    } else {
      // Calcular padding mais conservador baseado nos valores
      const paddingPercent = 0.08; // Reduzido para 8% de padding
      const padding = Math.max(maxValue * paddingPercent, 50); // Mínimo de R$ 50 de padding

      
      // Calcular limites
      let yMin = minValue;
      let yMax = maxValue + padding;

      // Se o valor mínimo é positivo, começar do zero para melhor contexto visual
      if (minValue >= 0) {
        yMin = 0;
      } else {
        // Para valores negativos, adicionar padding também embaixo
        yMin = minValue - padding;
      }
      
      // Ajustar o maxValue para ser mais próximo do valor real
      // Arredondar para o próximo "número bonito" mais próximo
      let dynamicMax;
      if (maxValue < 100) {
        // Para valores pequenos, arredondar para dezenas
        dynamicMax = Math.ceil(yMax / 10) * 10;
      } else if (maxValue < 1000) {
        // Para valores médios, arredondar para centenas
        dynamicMax = Math.ceil(yMax / 100) * 100;
      } else {
        // Para valores grandes, arredondar para milhares
        dynamicMax = Math.ceil(yMax / 1000) * 1000;
      }
      // Garantir que o valor máximo não seja menor que o valor real + padding mínimo
      dynamicMax = Math.max(dynamicMax, maxValue + (maxValue * 0.05));

      // Se houver valores negativos precisamos compensar o deslocamento
      // A lib considera maxValue relativo a 0, portanto quando usamos yAxisOffset
      // (que é negativo) devemos somar o módulo desse offset ao valor máximo para
      // manter a proporção correta e evitar que pontos positivos saiam da área.

      const adjustedMaxValue = yMin < 0 ? dynamicMax + Math.abs(yMin) : dynamicMax;

      yAxisProps = {
        yAxisOffset: yMin,
        maxValue: adjustedMaxValue,
        noOfSections: 4, // Número de seções no eixo Y
      };
    }
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