import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BalanceHistory } from '../../data/mockData';
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
  const isDark = theme === 'dark';
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(300); // Default width, will be updated on layout

  useEffect(() => {
    if (hoveredPoint !== null) {
      const timer = setTimeout(() => setHoveredPoint(null), 3000);
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

  const values = chartData.map(item => item.balance).filter(b => b !== null) as number[];
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const range = maxValue - minValue || 1;

  const chartHeight = 240;

  const getPointPosition = (index: number, balance: number | null) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    if (balance === null) return { x, y: chartHeight, value: null };
    const y = chartHeight - ((balance - minValue) / range) * chartHeight;
    return { x, y, value: balance };
  };

  const points = chartData
    .map((item, index) => getPointPosition(index, item.balance))
    .filter(p => p.value !== null) as { x: number; y: number; value: number; }[];

  const lineSegments: { x: number, y: number, value: number }[][] = [];
  let currentSegment: { x: number, y: number, value: number }[] = [];

  chartData.forEach((item, index) => {
    const point = getPointPosition(index, item.balance);
    if (point.value !== null) {
      currentSegment.push(point);
    } else {
      if (currentSegment.length > 1) {
        lineSegments.push(currentSegment);
      }
      currentSegment = [];
    }
  });
  if (currentSegment.length > 1) {
    lineSegments.push(currentSegment);
  }

  return (
    <Card className="min-h-[400px] p-4">
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Histórico de Saldo
      </Text>
      
      <View className="flex-row flex-1">
        <View className="pr-2 justify-between" style={{ height: chartHeight }}>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(maxValue)}</Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(minValue + range * 0.75)}</Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(minValue + range * 0.5)}</Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(minValue + range * 0.25)}</Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(minValue)}</Text>
        </View>

        <View className="flex-1">
          <View
            className="relative"
            style={{ height: chartHeight }}
            onLayout={(event) => {
              const newWidth = event.nativeEvent.layout.width;
              if (newWidth > 0 && newWidth !== chartWidth) {
                setChartWidth(newWidth);
              }
            }}
          >
            <View className="absolute inset-0">
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                <View
                  key={ratio}
                  className={`absolute w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  style={{ top: chartHeight - (ratio * chartHeight) }}
                />
              ))}
            </View>
            
            {lineSegments.map((segment, segIndex) => (
              <React.Fragment key={segIndex}>
                <View className="absolute inset-0">
                  {segment.slice(0, -1).map((point, index) => {
                    const nextPoint = segment[index + 1];
                    const segmentWidth = nextPoint.x - point.x;
                    const steps = 8;
                    const stepWidth = segmentWidth / steps;
                    
                    return (
                      <View key={index} className="absolute">
                        {Array.from({ length: steps }).map((_, stepIndex) => {
                          const progress = stepIndex / steps;
                          const currentY = point.y + (nextPoint.y - point.y) * progress;
                          return (
                            <View
                              key={stepIndex}
                              className="absolute bg-blue-500 opacity-15"
                              style={{
                                left: point.x + stepIndex * stepWidth,
                                top: currentY,
                                width: stepWidth + 1,
                                height: chartHeight - currentY,
                              }}
                            />
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
                <View className="absolute inset-0">
                  {segment.slice(0, -1).map((point, index) => {
                    const nextPoint = segment[index + 1];
                    const distance = Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y);
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
              </React.Fragment>
            ))}
            
            <View className="absolute inset-0">
              {points.map((point, index) => (
                <TouchableOpacity
                  key={index}
                  className="absolute"
                  onPress={() => setHoveredPoint(hoveredPoint === index ? null : index)}
                  activeOpacity={0.7}
                  style={{
                    left: point.x - 12, top: point.y - 12,
                    width: 24, height: 24,
                    justifyContent: 'center', alignItems: 'center',
                  }}
                >
                  <View className={`w-4 h-4 bg-blue-500 rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'} shadow-sm`} />
                  {hoveredPoint === index && (
                    <View className="absolute bg-black bg-opacity-90 px-2 py-1 rounded z-10" style={{ bottom: 30 }}>
                      <Text className="text-white text-xs whitespace-nowrap text-center">
                        {formatCurrency(point.value)}
                      </Text>
                      <View className="absolute top-full left-1/2 -ml-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex-row justify-between mt-2">
            {chartData.map((item) => (
              <Text key={item.month} className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default BalanceHistoryChart; 