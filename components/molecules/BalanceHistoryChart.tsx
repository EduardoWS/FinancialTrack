import { LinearGradient } from 'expo-linear-gradient';
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

const getLast12Months = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const today = new Date();
  const result = [];
  for (let i = 11; i >= 0; i--) {
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
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const [containerWidth, setContainerWidth] = useState(0);

  const monthLabels = getLast12Months();

  const chartData = monthLabels.map(labelInfo => {
    const dataPoint = data.find(d => d.month === labelInfo.label);
    return {
      value: dataPoint?.balance,
      label: labelInfo.label,
    };
  }).filter(item => item.value !== undefined);

  // Simplificar o cálculo de dimensões para evitar overflow
  const getChartSpacing = () => {
    if (isMobile) {
      // Valores fixos para mobile para evitar problemas
      return 25;
    }
    // Desktop: cálculo dinâmico mais conservador
    if (containerWidth <= 0) return 40;
    const numPoints = chartData.length;
    const availableWidth = containerWidth - 80; // Margem maior para segurança
    const spacing = Math.max(25, Math.min(50, availableWidth / (numPoints + 1)));
    return spacing;
  };

  const spacing = getChartSpacing();
  
  // Altura fixa para mobile, responsiva para desktop
  const cardHeight = isMobile ? 320 : undefined;
  const chartHeight = isMobile ? 220 : 250;

  return (
    <Card 
      className="p-4" 
      style={cardHeight ? { height: cardHeight } : {}}
    >
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Histórico de Saldo
      </Text>
      <View 
        className={isMobile ? '' : 'flex-1'}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {/* Aguardar largura do container ou usar valores fixos no mobile */}
        {(containerWidth > 0 || isMobile) && (
          <View style={{ overflow: 'hidden' }}>
            <LineChart
              data={chartData}
              height={chartHeight}
              thickness={3}
              color={isDark ? "#3B82F6" : "#60A5FA"}
              areaChart
              // @ts-ignore
              lineGradientComponent={LinearGradient}
              startFillColor={isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(96, 165, 250, 0.3)"}
              endFillColor={isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(96, 165, 250, 0.1)"}
              dataPointsColor={isDark ? "#3B82F6" : "#60A5FA"}
              dataPointsRadius={5}
              spacing={spacing}
              rulesColor={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}
              noOfSections={5}
              yAxisTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
              xAxisLabelTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
              // initialSpacing={20}
              endSpacing={10}
              pointerConfig={{
                pointerStripHeight: chartHeight * 0.8,
                pointerStripColor: 'lightgray',
                pointerStripWidth: 2,
                pointerColor: 'lightgray',
                radius: 6,
                pointerLabelWidth: 120,
                pointerLabelHeight: 90,
                activatePointersOnLongPress: true,
                autoAdjustPointerLabelPosition: false,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View
                      style={{
                        height: 90,
                        width: 120,
                        justifyContent: 'center',
                        marginTop: -30,
                        marginLeft: -40,
                      }}>
                      <Text style={{ color: isDark ? 'white' : 'black', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                        {items[0].label}
                      </Text>
                      <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: isDark ? '#3B82F6' : '#60A5FA' }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                          {formatCurrency(items[0].value)}
                        </Text>
                      </View>
                    </View>
                  );
                },
              }}
            />
          </View>
        )}
      </View>
    </Card>
  );
};

export default BalanceHistoryChart; 