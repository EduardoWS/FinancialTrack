import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { DateFilter } from '../../hooks/useTransactions';
import { useTheme } from '../../services/ThemeContext';
import { fetchUserTransactions } from '../../services/transacoesService';
import ComboBox, { ComboBoxItem } from '../atoms/ComboBox';

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: DateFilter) => void;
  currentFilter: DateFilter;
}

type FilterKind = 'all' | 'year' | 'month' | 'day';

const monthsPt: string[] = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isMobile = screenWidth < 768;

  const [filterKind, setFilterKind] = useState<FilterKind>('month');
  const [earliestYear, setEarliestYear] = useState<number>(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Carrega anos disponíveis
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const transactions = await fetchUserTransactions();
        if (transactions.length === 0) {
          setEarliestYear(new Date().getFullYear());
          return;
        }
        const firstDate = transactions.reduce((prev, curr) => {
          const dPrev = new Date(prev.date);
          const dCurr = new Date(curr.date);
          return dCurr < dPrev ? curr : prev;
        });
        const minYear = new Date(firstDate.date).getFullYear();
        setEarliestYear(minYear);
      } catch (err) {
        console.error('Erro ao buscar transações para anos:', (err as any).message);
      }
    })();
  }, [visible]);

  // Quando modal abrir, sincroniza estados com currentFilter
  useEffect(() => {
    if (!visible) return;
    switch (currentFilter.type) {
      case 'all':
        setFilterKind('all');
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        break;
      case 'year':
        setFilterKind('year');
        setSelectedYear(currentFilter.year);
        setSelectedMonth(null);
        setSelectedDay(null);
        break;
      case 'month':
        setFilterKind('month');
        setSelectedYear(currentFilter.year);
        setSelectedMonth(currentFilter.month);
        setSelectedDay(null);
        break;
      case 'day':
        setFilterKind('day');
        setSelectedYear(currentFilter.date.getFullYear());
        setSelectedMonth(currentFilter.date.getMonth());
        setSelectedDay(currentFilter.date.getDate());
        break;
    }
  }, [currentFilter, visible]);

  const years: ComboBoxItem<number>[] = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr: ComboBoxItem<number>[] = [];
    for (let y = earliestYear; y <= currentYear; y++) {
      arr.push({ label: String(y), value: y });
    }
    return arr;
  }, [earliestYear]);

  const months: ComboBoxItem<number>[] = monthsPt.map((m, idx) => ({
    label: m,
    value: idx,
  }));

  const days: ComboBoxItem<number>[] = useMemo(() => {
    if (selectedYear === null || selectedMonth === null) return [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: String(i + 1).padStart(2, '0'),
      value: i + 1,
    }));
  }, [selectedYear, selectedMonth]);

  const canApply = useMemo(() => {
    if (filterKind === 'all') return true;
    if (filterKind === 'year') return selectedYear !== null;
    if (filterKind === 'month') return selectedYear !== null && selectedMonth !== null;
    if (filterKind === 'day')
      return (
        selectedYear !== null &&
        selectedMonth !== null &&
        selectedDay !== null
      );
    return false;
  }, [filterKind, selectedYear, selectedMonth, selectedDay]);

  const applyFilter = () => {
    if (!canApply) return;
    let filter: DateFilter = { type: 'all' };
    switch (filterKind) {
      case 'all':
        filter = { type: 'all' };
        break;
      case 'year':
        filter = { type: 'year', year: selectedYear as number };
        break;
      case 'month':
        filter = {
          type: 'month',
          year: selectedYear as number,
          month: selectedMonth as number,
        };
        break;
      case 'day':
        filter = {
          type: 'day',
          date: new Date(
            selectedYear as number,
            selectedMonth as number,
            selectedDay as number
          ),
        };
        break;
    }
    onApply(filter);
  };

  if (!visible) return null;

  const renderContent = () => (
    <>
      {/* Tipo de filtro */}
      <View className="mb-6">
        <Text
          className={`text-sm font-semibold mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Tipo de Filtro
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {([
            { kind: 'all', label: 'Tudo' },
            { kind: 'year', label: 'Ano' },
            { kind: 'month', label: 'Mês' },
            { kind: 'day', label: 'Dia' },
          ] as { kind: FilterKind; label: string }[]).map((opt) => (
            <TouchableOpacity
              key={opt.kind}
              onPress={() => setFilterKind(opt.kind)}
              className={`px-4 py-3 rounded-xl border-2 ${
                filterKind === opt.kind
                  ? 'border-blue-500 bg-blue-500/20'
                  : isDark
                  ? 'border-gray-600 bg-gray-800'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filterKind === opt.kind
                    ? 'text-blue-600'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seletor de Ano */}
      {(filterKind === 'year' || filterKind === 'month' || filterKind === 'day') && (
        <View className="mb-6">
          <Text
            className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Ano
          </Text>
          <ComboBox
            items={years}
            selectedValue={selectedYear}
            onValueChange={(val: number) => {
              setSelectedYear(val);
              // Ao mudar o ano, pode resetar dependentes
              if (filterKind === 'day') {
                setSelectedMonth(null);
                setSelectedDay(null);
              } else if (filterKind === 'month') {
                setSelectedMonth(null);
              }
            }}
            placeholder="Selecione o ano"
          />
        </View>
      )}

      {/* Seletor de Mês */}
      {(filterKind === 'month' || filterKind === 'day') && (
        <View className="mb-6">
          <Text
            className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Mês
          </Text>
          <ComboBox
            items={months}
            selectedValue={selectedMonth}
            onValueChange={(val: number) => {
              setSelectedMonth(val);
              if (filterKind === 'day') {
                setSelectedDay(null);
              }
            }}
            placeholder="Selecione o mês"
            disabled={selectedYear === null}
          />
        </View>
      )}

      {/* Seletor de Dia */}
      {filterKind === 'day' && (
        <View className="mb-6">
          <Text
            className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Dia
          </Text>
          <ComboBox
            items={days}
            selectedValue={selectedDay}
            onValueChange={(val: number) => setSelectedDay(val)}
            placeholder="Selecione o dia"
            disabled={selectedYear === null || selectedMonth === null}
          />
        </View>
      )}
    </>
  );

  const renderMobileModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-end">
      <View
        className={`rounded-t-3xl min-h-[60vh] max-h-[90vh] ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Text
            className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Filtrar Transações
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Ionicons name="close" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>

        {/* Footer */}
        <View
          className={`p-6 border-t flex-row space-x-4 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <TouchableOpacity
            onPress={onClose}
            className={`flex-1 py-4 rounded-xl border-2 ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            <Text
              className={`text-center font-semibold text-base ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={applyFilter}
            className={`flex-1 py-4 rounded-xl ${
              canApply ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}
            disabled={!canApply}
          >
            <Text className="text-center font-semibold text-base text-white">
              Aplicar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderWebModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-6">
      <View
        className={`rounded-2xl shadow-2xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}
        style={{ width: Math.min(screenWidth * 0.85, 600), maxHeight: screenHeight * 0.85 }}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Text
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Filtrar Transações
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Ionicons name="close" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>

        {/* Footer */}
        <View
          className={`p-6 border-t flex-row space-x-4 justify-end ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <TouchableOpacity
            onPress={onClose}
            className={`px-8 py-3 rounded-xl border-2 ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}
          >
            <Text
              className={`font-semibold text-base ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={applyFilter}
            className={`px-8 py-3 rounded-xl ${
              canApply ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}
            disabled={!canApply}
          >
            <Text className="text-white font-semibold text-base">Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      {isMobile ? renderMobileModal() : renderWebModal()}
    </Modal>
  );
};

export default TransactionFilterModal; 