import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BalanceHistory } from '../../data/mockData';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface BalanceHistoryChartProps {
  data: BalanceHistory[];
}

// Helper para obter os últimos 12 meses
const getLast12Months = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const today = new Date();
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push({
      label: months[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth() + 1 // 1-12
    });
  }
  return result;
};


const BalanceHistoryChart: React.FC<BalanceHistoryChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Auto-dismiss tooltip after 3 seconds
  useEffect(() => {
    if (hoveredPoint !== null) {
      const timer = setTimeout(() => {
        setHoveredPoint(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hoveredPoint]);

  const monthLabels = getLast12Months();

  const chartData = monthLabels.map(labelInfo => {
    const dataPoint = data.find(d => d.month === labelInfo.label);
    return {
      month: labelInfo.label,
      balance: dataPoint ? dataPoint.balance : null,
    };
  });

  // Encontra os valores min e max para normalizar o gráfico, ignorando nulos
  const values = chartData.map(item => item.balance).filter(b => b !== null) as number[];
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const range = maxValue - minValue;

  // Calcula pontos para a linha
  const chartHeight = 240;
  const chartWidth = 300;
  
  const points = chartData.map((item, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    if (item.balance === null) {
        return { x, y: chartHeight, value: null };
    }
    const y = range > 0 ? chartHeight - ((item.balance - minValue) / range) * chartHeight : chartHeight / 2;
    return { x, y, value: item.balance };
  }).filter(p => p.value !== null);

  const lineSegments = [];
  let currentSegment: typeof points = [];

  chartData.forEach((item, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    if (item.balance !== null) {
        const y = range > 0 ? chartHeight - ((item.balance - minValue) / range) * chartHeight : chartHeight / 2;
        currentSegment.push({ x, y, value: item.balance });
    } else {
        if (currentSegment.length > 0) {
            lineSegments.push(currentSegment);
            currentSegment = [];
        }
    }
  });
  if (currentSegment.length > 0) {
    lineSegments.push(currentSegment);
  }


  return (
    <Card className="min-h-[400px]">
      <View className="flex-1 relative" style={{ height: chartHeight + 20 }}>
        {/* Grid horizontal (linhas de referência) */}
        <View className="absolute inset-0" style={{ height: chartHeight }}>
          {/* Área preenchida sob a linha */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {lineSegments.map((segment, segIndex) => (
                <React.Fragment key={segIndex}>
                    {segment.slice(0, -1).map((point, index) => {
                        const nextPoint = segment[index + 1];
                        if (!nextPoint) return null;
                        const segmentWidth = nextPoint.x - point.x;
                        
                        // Criar gradiente visual simulado com múltiplos segmentos
                        const steps = 8;
                        const stepWidth = segmentWidth / steps;
                        
                        return (
                            <View key={index} className="absolute">
                            {Array.from({ length: steps }).map((_, stepIndex) => {
                                const progress = stepIndex / steps;
                                const nextProgress = (stepIndex + 1) / steps;
                                
                                // Interpolação suave entre pontos
                                const currentY = point.y + (nextPoint.y - point.y) * progress;
                                const nextY = point.y + (nextPoint.y - point.y) * nextProgress;
                                const avgY = (currentY + nextY) / 2;
                                
                                return (
                                <View
                                    key={stepIndex}
                                    className="absolute bg-blue-500 opacity-15"
                                    style={{
                                    left: point.x + stepIndex * stepWidth,
                                    top: avgY,
                                    width: stepWidth + 1,
                                    height: chartHeight - avgY,
                                    }}
                                />
                                );
                            })}
                            </View>
                        );
                    })}
                </React.Fragment>
            ))}
          </View>

          {/* Linha do gráfico */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {lineSegments.map((segment, segIndex) => (
                <React.Fragment key={segIndex}>
                    {segment.slice(0, -1).map((point, index) => {
                        const nextPoint = segment[index + 1];
                        if(!nextPoint) return null;
                        const distance = Math.sqrt(
                            Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
                        );
                        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
                        
                        return (
                            <View
                            key={index}
                            className="absolute bg-blue-500"
                            style={{
                                left: point.x,
                                top: point.y - 1.5,
                                width: distance,
                                height: 3,
                                transform: [{ rotate: `${angle}rad` }],
                                transformOrigin: '0 50%',
                            }}
                            />
                        );
                    })}
                </React.Fragment>
            ))}
          </View>

          {/* Pontos interativos */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {points.map((point, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setHoveredPoint(index)}
                onLongPress={() => setHoveredPoint(index)}
                style={{
                  left: point.x,
                  top: point.y,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: hoveredPoint === index ? 'blue' : 'transparent',
                }}
              />
            ))}
          </View>
        </View>

        {/* Labels dos meses */}
        <View className="flex-row justify-between" style={{ marginLeft: 32 }}>
          {chartData.map((item, index) => (
            <Text
              key={index}
              className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {item.month}
            </Text>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default BalanceHistoryChart; 