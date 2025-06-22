import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddMetaModal from '../AddMetaModal';

// ----- MOCKS (sem alterações) -----
jest.mock('../../../services/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return { Ionicons: (props: any) => <View {...props} /> };
});

jest.spyOn(Alert, 'alert');

// ----- TESTES -----
describe('AddMetaModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir um alerta se o nome da meta estiver vazio', async () => {
    const { getByText } = render(
      <AddMetaModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );
    fireEvent.press(getByText(/Criar/i));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Nome da meta é obrigatório');
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // ***** TESTE CORRIGIDO *****
  it('deve exibir um alerta se o valor da meta for zero ou inválido', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AddMetaModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Viagem para Europa'), 'Minha Viagem');
    
    // CORREÇÃO: Usando getByTestId para selecionar o campo exato
    const valorMetaInput = getByTestId('input-valor-meta');
    fireEvent.changeText(valorMetaInput, '0');

    fireEvent.press(getByText(/Criar/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Valor da meta deve ser maior que zero');
    });
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // ***** TESTE CORRIGIDO *****
  it('deve chamar onSave com os dados corretos ao preencher o formulário completo', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AddMetaModal visible={true} onClose={mockOnClose} onSave={mockOnSave} />
    );

    // --- Ação (Act) ---

    // 1. Preenche os campos de texto usando placeholder e testID
    fireEvent.changeText(getByPlaceholderText('Ex: Viagem para Europa'), 'Viagem para o Japão');
    fireEvent.changeText(getByPlaceholderText('AAAA-MM-DD'), '2026-10-15');

    // CORREÇÃO: Selecionando os campos de valor pelos seus testIDs
    const valorMetaInput = getByTestId('input-valor-meta');
    const valorAtualInput = getByTestId('input-valor-atual');
    fireEvent.changeText(valorMetaInput, '20000');
    fireEvent.changeText(valorAtualInput, '1500');

    // 2. Seleciona o tipo, cor e ícone
    fireEvent.press(getByTestId('tipo-selector-viagem'));
    fireEvent.press(getByTestId('color-selector-#EF4444'));
    fireEvent.press(getByTestId('icone-selector-✈️'));

    // 3. Submete o formulário
    fireEvent.press(getByText(/Criar/i));

    // --- Verificação (Assert) ---
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        nome: 'Viagem para o Japão',
        valorMeta: 20000,
        valorAtual: 1500,
        tipo: 'viagem',
        cor: '#EF4444',
        icone: '✈️',
        dataInicio: expect.any(Date),
        // O componente converte a string 'AAAA-MM-DD' para um objeto Date.
        // new Date('string') pode variar com o timezone. Para ser preciso, 
        // criamos um objeto Date que corresponde ao início do dia naquela data em UTC.
        dataLimite: new Date('2026-10-15T00:00:00.000Z'),
        descricao: undefined,
        finalizada: false,
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });
});