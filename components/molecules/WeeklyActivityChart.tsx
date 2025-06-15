import React from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
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

  const barData: {
    value: number,
    label?: string,
    frontColor: string,
    income: number,
    expense: number,
    day: string
  }[] = [];

  data.forEach(item => {
    barData.push({
      value: item.income,
      label: item.day,
      frontColor: '#14B8A6', // Teal-500
      income: item.income,
      expense: item.expense,
      day: item.day,
    });
    barData.push({
      value: item.expense,
      frontColor: '#EF4444', // Red-500
      income: item.income,
      expense: item.expense,
      day: item.day,
    });
  });

  return (
    <Card className="p-4">
      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Atividade Semanal
      </Text>
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
      <View>
        <BarChart
          data={barData}
          isAnimated
          height={250}
          barWidth={18}
          rulesColor={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"}
          yAxisTextStyle={{ color: isDark ? '#A0AEC0' : '#718096' }}
          xAxisLabelTextStyle={{ color: isDark ? '#A0AEC0' : '#718096', textAlign: 'center' }}
          renderTooltip={(item: any) => {
            return (
              <View style={{
                backgroundColor: isDark ? 'black' : 'white',
                padding: 10,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: isDark ? '#A0AEC0' : '#718096',
              }}>
                <Text style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>{item.day}</Text>
                <Text style={{ color: '#14B8A6' }}>Entrada: {formatCurrency(item.income)}</Text>
                <Text style={{ color: '#EF4444' }}>Saída: {formatCurrency(item.expense)}</Text>
              </View>
            )
          }}
        />
      </View>
    </Card>
  );
};

export default WeeklyActivityChart; 