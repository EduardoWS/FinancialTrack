import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import { DateFilter } from '../../hooks/useTransactions';
import { useTheme } from '../../services/ThemeContext';

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: DateFilter) => void;
  currentFilter: DateFilter;
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const [localFilter, setLocalFilter] = useState<DateFilter>(currentFilter);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      if (localFilter.type === 'day') {
        setLocalFilter({ type: 'day', date: selectedDate });
      } else if (localFilter.type === 'month') {
        setLocalFilter({ type: 'month', year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
      } else if (localFilter.type === 'year') {
        setLocalFilter({ type: 'year', year: selectedDate.getFullYear() });
      }
    }
  };

  const getDisplayDate = (): string => {
    switch(localFilter.type) {
      case 'day': return localFilter.date.toLocaleDateString('pt-BR');
      case 'month': return new Date(localFilter.year, localFilter.month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      case 'year': return String(localFilter.year);
      default: return 'Todas';
    }
  };

  const renderContent = () => (
    <>
      <View className="mb-6">
        <Text className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Filtrar por
        </Text>
        <View className="flex-row space-x-2">
          {['month', 'year', 'day', 'all'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                if (type === 'all') setLocalFilter({ type: 'all' });
                else if (type === 'day') setLocalFilter({ type: 'day', date: new Date() });
                else if (type === 'month') setLocalFilter({ type: 'month', year: new Date().getFullYear(), month: new Date().getMonth() });
                else if (type === 'year') setLocalFilter({ type: 'year', year: new Date().getFullYear() });
              }}
              className={`flex-1 py-2 rounded-lg border-2 ${
                localFilter.type === type
                  ? 'border-blue-500 bg-blue-500/20'
                  : isDark ? 'border-gray-600' : 'border-gray-300'
              }`}
            >
              <Text className={`text-center font-medium ${
                localFilter.type === type ? 'text-blue-500' : isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {{'day':'Dia', 'month':'Mês', 'year':'Ano', 'all':'Tudo'}[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {localFilter.type !== 'all' && (
        <View className="mb-6">
          <Text className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Selecione o período
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className={`p-4 rounded-xl border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
          >
            <Text className={`text-center text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{getDisplayDate()}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={localFilter.type === 'day' ? localFilter.date : new Date(localFilter.type === 'month' ? localFilter.year : (localFilter.type === 'year' ? localFilter.year : new Date().getFullYear()), localFilter.type === 'month' ? localFilter.month : new Date().getMonth())}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );

  return (
    <Modal visible={visible} transparent={true} animationType={isMobile ? "slide" : "fade"} onRequestClose={onClose}>
      <View className={`flex-1 justify-center items-center ${isMobile ? 'justify-end' : 'bg-black/50'}`}>
        <View className={`${isMobile ? 'w-full rounded-t-3xl' : 'w-[400px] rounded-2xl shadow-2xl'} ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <View className={`flex-row items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filtrar Transações</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} /></TouchableOpacity>
          </View>
          
          <View className="p-6">{renderContent()}</View>

          <View className={`p-6 border-t flex-row space-x-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} ${isMobile ? '' : 'justify-end'}`}>
            <TouchableOpacity onPress={onClose} className={`flex-1 py-3 rounded-xl border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'} ${!isMobile && 'flex-none px-6'}`}>
              <Text className={`text-center font-semibold text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onApply(localFilter)} className={`flex-1 py-3 rounded-xl bg-blue-600 ${!isMobile && 'flex-none px-6'}`}>
              <Text className="text-white font-semibold text-base text-center">Aplicar Filtro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionFilterModal; 