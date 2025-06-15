import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { WeeklyActivity } from '../../data/mockData';
import { formatCurrency } from '../../services/dashboardService';
import { useTheme } from '../../services/ThemeContext';
import Card from '../atoms/Card';

interface WeeklyActivityChartProps {
  data: WeeklyActivity[];
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredBar, setHoveredBar] = useState<{ index: number; type: 'income' | 'expense' } | null>(null);

  // Auto-dismiss tooltip after 3 seconds
  useEffect(() => {
    if (hoveredBar) {
      const timer = setTimeout(() => {
        setHoveredBar(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hoveredBar]);

  // Encontra o valor máximo para normalizar as barras
  const maxValue = Math.max(
    ...data.flatMap(item => [item.income, item.expense])
  );

  const chartHeight = 240;

  return (
    <Card className="min-h-[400px]">
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Atividade Semanal
      </Text>
      
      {/* Legenda */}
      <View className="flex-row mb-4 justify-center">
        <View className="flex-row items-center mr-6">
          <View className="w-3 h-3 rounded-full bg-teal-500 mr-2" />
          <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Entrada
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Saída
          </Text>
        </View>
      </View>

      {/* Container do gráfico com eixo Y */}
      <View className="flex-row flex-1">
        {/* Eixo Y */}
        <View className="mr-3 justify-between" style={{ height: chartHeight + 20 }}>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(maxValue)}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(Math.round(maxValue * 0.75))}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(Math.round(maxValue * 0.5))}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(Math.round(maxValue * 0.25))}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatCurrency(0)}
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

          {/* Container das barras */}
          <View className="flex-row items-end justify-between absolute inset-0" style={{ height: chartHeight }}>
            {data.map((item, index) => {
              const incomeHeight = Math.max((item.income / maxValue) * chartHeight, item.income > 0 ? 4 : 0);
              const expenseHeight = Math.max((item.expense / maxValue) * chartHeight, item.expense > 0 ? 4 : 0);

              return (
                <View key={index} className="flex-1 mx-1 items-center h-full justify-end relative">
                  {/* Container das barras */}
                  <View className="flex-row items-end justify-center">
                    {/* Barra de entrada */}
                    <TouchableOpacity
                      className="relative"
                      onPress={() => setHoveredBar(hoveredBar?.index === index && hoveredBar?.type === 'income' ? null : { index, type: 'income' })}
                      activeOpacity={0.7}
                    >
                      <View
                        className={`bg-teal-500 rounded-t-sm mr-0.5 ${
                          hoveredBar?.index === index && hoveredBar?.type === 'income' ? 'opacity-80' : ''
                        }`}
                        style={{ 
                          height: incomeHeight,
                          width: 12,
                        }}
                      />
                      
                      {/* Tooltip para entrada */}
                      {hoveredBar?.index === index && hoveredBar?.type === 'income' && item.income > 0 && (
                        <View className="absolute bg-black bg-opacity-90 px-2 py-1 rounded z-10" 
                              style={{
                                bottom: incomeHeight + 5,
                                left: -15,
                              }}>
                          <Text className="text-white text-xs whitespace-nowrap">
                            {formatCurrency(item.income)}
                          </Text>
                          {/* Pequena seta */}
                          <View className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black opacity-90" style={{ marginLeft: -4 }} />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Barra de saída */}
                    <TouchableOpacity
                      className="relative"
                      onPress={() => setHoveredBar(hoveredBar?.index === index && hoveredBar?.type === 'expense' ? null : { index, type: 'expense' })}
                      activeOpacity={0.7}
                    >
                      <View
                        className={`bg-red-500 rounded-t-sm ml-0.5 ${
                          hoveredBar?.index === index && hoveredBar?.type === 'expense' ? 'opacity-80' : ''
                        }`}
                        style={{ 
                          height: expenseHeight,
                          width: 12,
                        }}
                      />
                      
                      {/* Tooltip para saída */}
                      {hoveredBar?.index === index && hoveredBar?.type === 'expense' && item.expense > 0 && (
                        <View className="absolute bg-black bg-opacity-90 px-2 py-1 rounded z-10"
                              style={{
                                bottom: expenseHeight + 5,
                                left: -15,
                              }}>
                          <Text className="text-white text-xs whitespace-nowrap">
                            {formatCurrency(item.expense)}
                          </Text>
                          {/* Pequena seta */}
                          <View className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black opacity-90" style={{ marginLeft: -4 }} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
          
          {/* Labels dos dias */}
          <View className="flex-row justify-between absolute bottom-0 left-0 right-0" style={{ height: 20 }}>
            {data.map((item, index) => (
              <View key={index} className="flex-1 items-center">
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default WeeklyActivityChart; 