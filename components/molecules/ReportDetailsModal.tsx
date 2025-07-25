import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useScreenSize } from '../../hooks/useScreenSize';
import { useTheme } from '../../services/ThemeContext';

interface ReportItem {
  id: string;
  type: 'alert' | 'tip';
  title: string;
  description?: string;
  category?: string;
}

interface ReportDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  item: ReportItem | null;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  visible,
  onClose,
  item,
}) => {
  const { theme } = useTheme();
  const { isMobile } = useScreenSize();
  const isDark = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  if (!item) return null;

  const getIcon = (type: 'alert' | 'tip') => {
    const iconSize = isMobile ? 24 : 32;
    const containerSize = isMobile ? 'w-12 h-12' : 'w-16 h-16';
    
    if (type === 'alert') {
      return (
        <View className={`${containerSize} bg-red-100 rounded-full items-center justify-center`}>
          <Ionicons name="warning" size={iconSize} color="#DC2626" />
        </View>
      );
    } else {
      return (
        <View className={`${containerSize} bg-yellow-100 rounded-full items-center justify-center`}>
          <Ionicons name="bulb" size={iconSize} color="#D97706" />
        </View>
      );
    }
  };

  const getRecommendations = (item: ReportItem): string[] => {
    if (item.type === 'alert') {
      if (item.category === 'Lazer') {
        return [
          'Defina um limite mensal para gastos com lazer',
          'Procure opções gratuitas ou mais baratas de entretenimento',
          'Avalie se todos os gastos com lazer são realmente necessários',
          'Considere cortar algumas assinaturas de streaming ou serviços similares'
        ];
      } else if (item.category === 'Poupança') {
        return [
          'Revise seus gastos mensais para identificar onde é possível economizar',
          'Considere fazer uma transferência automática para a poupança',
          'Estabeleça uma meta menor e mais realista se necessário',
          'Procure fontes de renda extra para acelerar suas economias'
        ];
      } else if (item.category === 'Cartão de Crédito') {
        return [
          'Monitore seus gastos no cartão de crédito diariamente',
          'Considere pagar antecipadamente para reduzir o limite usado',
          'Avalie se é necessário solicitar aumento de limite',
          'Use cartão de débito para compras menores'
        ];
      }
    } else {
      if (item.title.includes('orçamento')) {
        return [
          'Use aplicativos de controle financeiro para monitorar gastos',
          'Categorize todas as suas despesas mensais',
          'Estabeleça limites para cada categoria de gasto',
          'Faça uma revisão semanal dos seus gastos'
        ];
      } else if (item.title.includes('dívidas')) {
        return [
          'Liste todas as suas dívidas com juros e valores',
          'Priorize o pagamento das dívidas com maiores juros primeiro',
          'Considere renegociar dívidas com juros muito altos',
          'Evite contrair novas dívidas enquanto quita as existentes'
        ];
      } else if (item.title.includes('investir')) {
        return [
          'Estude sobre diferentes tipos de investimentos',
          'Comece com investimentos de baixo risco',
          'Diversifique sua carteira de investimentos',
          'Consulte um especialista financeiro'
        ];
      }
    }
    return ['Entre em contato conosco para orientações personalizadas'];
  };

  const recommendations = getRecommendations(item);

  // Layout mobile responsivo
  const renderMobileModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-end">
      <View 
        className={`
          rounded-t-3xl min-h-[70vh] max-h-[95vh]
          ${isDark ? 'bg-gray-900' : 'bg-white'}
        `}
      >
        {/* Header */}
        <View className={`
          flex-row items-center justify-between p-4 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <Text className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Detalhes do Relatório
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className={`
              w-8 h-8 rounded-full items-center justify-center
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
            `}
          >
            <Text className={`text-lg font-bold ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              ×
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView 
          className="flex-1 px-4 py-3"
          showsVerticalScrollIndicator={false}
        >
          {/* Ícone e Título compacto para mobile */}
          <View className="flex-row items-center mb-4">
            {getIcon(item.type)}
            <View className="flex-1 ml-3">
              <Text className={`text-base font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`} numberOfLines={2}>
                {item.title}
              </Text>
              {item.category && (
                <View className={`px-2 py-1 rounded-full mt-1 self-start ${
                  item.type === 'alert' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    item.type === 'alert' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {item.category}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Descrição */}
          {item.description && (
            <View className={`p-3 rounded-xl mb-4 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <Text className={`text-sm leading-5 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {item.description}
              </Text>
            </View>
          )}

          {/* Recomendações */}
          <View className="mb-4">
            <Text className={`text-base font-semibold mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.type === 'alert' ? 'Como resolver:' : 'Próximos passos:'}
            </Text>
            <View className="mb-3">
              {recommendations.map((recommendation, index) => (
                <View 
                  key={index}
                  className={`
                    flex-row items-start p-3 rounded-xl
                    ${index > 0 ? 'mt-2' : ''}
                    ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
                  `}
                >
                  <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 mt-0.5 ${
                    item.type === 'alert' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      item.type === 'alert' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text className={`flex-1 text-sm leading-5 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer com botão */}
        <View className={`
          p-4 border-t
          ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
        `}>
          <TouchableOpacity
            onPress={onClose}
            className={`py-3 px-4 rounded-xl items-center ${
              item.type === 'alert' ? 'bg-red-600' : 'bg-yellow-600'
            }`}
          >
            <Text className="text-white font-semibold text-base">
              Entendi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Layout web/desktop responsivo
  const renderWebModal = () => (
    <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-6">
      <View 
        className={`
          rounded-2xl shadow-2xl
          ${isDark ? 'bg-gray-800' : 'bg-white'}
        `}
        style={{
          width: Math.min(screenWidth * 0.9, 550),
          maxHeight: screenHeight * 0.85
        }}
      >
        {/* Header */}
        <View className={`
          flex-row items-center justify-between p-6 border-b
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <Text className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Detalhes do Relatório
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className={`
              w-8 h-8 rounded-full items-center justify-center
              ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
            `}
          >
            <Text className={`text-lg font-bold ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              ×
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView 
          className="flex-1 px-6 py-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Ícone e Título */}
          <View className="items-center mb-6">
            {getIcon(item.type)}
            <Text className={`text-lg font-semibold mt-4 text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </Text>
            {item.category && (
              <View className={`px-3 py-1 rounded-full mt-2 ${
                item.type === 'alert' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <Text className={`text-sm font-medium ${
                  item.type === 'alert' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {item.category}
                </Text>
              </View>
            )}
          </View>

          {/* Descrição */}
          {item.description && (
            <View className={`p-4 rounded-xl mb-6 ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Text className={`text-base leading-6 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {item.description}
              </Text>
            </View>
          )}

          {/* Recomendações */}
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.type === 'alert' ? 'Como resolver:' : 'Próximos passos:'}
            </Text>
            <View className="mb-3">
              {recommendations.map((recommendation, index) => (
                <View 
                  key={index}
                  className={`
                    flex-row items-start p-4 rounded-xl
                    ${index > 0 ? 'mt-3' : ''}
                    ${isDark ? 'bg-gray-750' : 'bg-gray-50'}
                  `}
                >
                  <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 mt-1 ${
                    item.type === 'alert' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <Text className={`text-xs font-bold ${
                      item.type === 'alert' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text className={`flex-1 text-base leading-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer com botão */}
        <View className={`
          p-6 border-t
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <TouchableOpacity
            onPress={onClose}
            className={`p-4 rounded-xl items-center ${
              item.type === 'alert' ? 'bg-red-600' : 'bg-yellow-600'
            }`}
          >
            <Text className="text-white font-semibold text-base">
              Entendi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      animationType={isMobile ? "slide" : "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {isMobile ? renderMobileModal() : renderWebModal()}
    </Modal>
  );
};

export default ReportDetailsModal; 