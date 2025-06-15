import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BalanceHistory } from '../../data/mockData';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface BalanceHistoryChartProps {
  data: BalanceHistory[];
}

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

  // Encontra os valores min e max para normalizar o gráfico
  const values = data.map(item => item.balance);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  // Calcula pontos para a linha
  const chartHeight = 240;
  const chartWidth = 300;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item.balance - minValue) / range) * chartHeight;
    return { x, y, value: item.balance };
  });

  return (
    <Card className="min-h-[400px]">
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Histórico de Saldo
      </Text>
      
      {/* Container do gráfico com eixo Y */}
      <View className="flex-row flex-1 mb-4">
        {/* Eixo Y */}
        <View className="mr-3 justify-between" style={{ height: chartHeight + 20 }}>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(maxValue)}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(Math.round(maxValue - (range * 0.25)))}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(Math.round(maxValue - (range * 0.5)))}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(Math.round(maxValue - (range * 0.75)))}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(minValue)}
          </Text>
        </View>

        {/* Área do gráfico */}
        <View className="flex-1 relative" style={{ height: chartHeight + 20 }}>
          {/* Grid horizontal (linhas de referência) */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <View
                key={index}
                className={`absolute w-full border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}
                style={{ top: ratio * chartHeight }}
              />
            ))}
          </View>

          {/* Área preenchida sob a linha */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {points.slice(0, -1).map((point, index) => {
              const nextPoint = points[index + 1];
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
          </View>

          {/* Linha do gráfico */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {/* Linha curva simulada com segmentos */}
            {points.slice(0, -1).map((point, index) => {
              const nextPoint = points[index + 1];
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
          </View>

          {/* Pontos interativos */}
          <View className="absolute inset-0" style={{ height: chartHeight }}>
            {points.map((point, index) => (
              <TouchableOpacity
                key={index}
                className="absolute"
                onPress={() => setHoveredPoint(hoveredPoint === index ? null : index)}
                activeOpacity={0.7}
                style={{
                  left: point.x - 12,
                  top: point.y - 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Ponto */}
                <View
                  className={`w-4 h-4 bg-blue-500 rounded-full border-2 ${
                    isDark ? 'border-gray-800' : 'border-white'
                  } shadow-sm ${
                    hoveredPoint === index ? 'opacity-80' : ''
                  }`}
                />
                
                {/* Tooltip */}
                {hoveredPoint === index && (
                  <View 
                    className="absolute bg-black bg-opacity-90 px-2 py-1 rounded z-10"
                    style={{
                      bottom: 30,
                      left: -25,
                      minWidth: 50,
                    }}
                  >
                    <Text className="text-white text-xs whitespace-nowrap text-center">
                      {formatCurrency(point.value)}
                    </Text>
                    {/* Pequena seta */}
                    <View className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black opacity-90" style={{ marginLeft: -4 }} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Labels dos meses */}
      <View className="flex-row justify-between" style={{ marginLeft: 32 }}>
        {data.map((item, index) => (
          <Text
            key={index}
            className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {item.month}
          </Text>
        ))}
      </View>
    </Card>
  );
};

export default BalanceHistoryChart; 