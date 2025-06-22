import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddCategoryModal from '../AddCategoryModal';

// ----- MOCKS -----
jest.mock('../../../services/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return { Ionicons: (props: any) => <View {...props} /> };
});

jest.spyOn(Alert, 'alert');

// ----- TESTES -----
describe('AddCategoryModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste de validação (caminho triste)
  it('deve exibir um alerta se o nome da categoria estiver vazio', async () => {
    const { getByText } = render(
      <AddCategoryModal
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        defaultType="expense" // Precisamos passar um tipo padrão
      />
    );

    fireEvent.press(getByText(/Criar/i));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Nome da categoria é obrigatório');
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // Teste de sucesso (caminho feliz)
  it('deve chamar onSave com os dados corretos ao criar uma nova categoria', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AddCategoryModal
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        defaultType="expense" // Começamos com despesa
      />
    );

    // --- Ação (Act): Simula o preenchimento ---

    // 1. Preenche o nome
    fireEvent.changeText(getByPlaceholderText('Ex: Supermercado, Transporte...'), 'Salário');

    // 2. Muda o tipo para "Receita"
    fireEvent.press(getByText('Receita'));

    // 3. Seleciona a cor e o ícone usando testIDs
    fireEvent.press(getByTestId('color-selector-#10B981')); // Verde
    fireEvent.press(getByTestId('icone-selector-💰'));       // Dinheiro

    // 4. Submete o formulário
    fireEvent.press(getByText(/Criar/i));

    // --- Verificação (Assert) ---
    await waitFor(() => {
      // Garante que onSave foi chamado uma vez
      expect(mockOnSave).toHaveBeenCalledTimes(1);

      // Garante que foi chamado com os dados exatos que inserimos
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Salário',
        type: 'income', // Verificamos que o tipo foi alterado para 'income'
        color: '#10B981',
        icon: '💰',
      });

      // Garante que o modal foi fechado
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      
      // Garante que nenhum alerta de erro foi exibido
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });
});