# Dashboard - Financial Track

## Implementação do Dashboard

Este dashboard foi implementado seguindo o design do Figma, com foco em responsividade e suporte a temas claro/escuro.

## Estrutura de Arquivos

```
├── app/(tabs)/dashboard.tsx           # Tela principal do dashboard
├── components/
│   ├── atoms/
│   │   ├── Card.tsx                   # Componente de card reutilizável
│   │   └── LoadingSpinner.tsx         # Componente de loading personalizado
│   └── molecules/
│       ├── WeeklyActivityChart.tsx    # Gráfico de atividade semanal
│       ├── RecentTransactions.tsx     # Lista de transações recentes
│       ├── BalanceHistoryChart.tsx    # Gráfico de histórico de saldo
│       └── CategoryExpensesChart.tsx  # Gráfico de gastos por categoria
├── data/
│   └── mockData.ts                    # Dados simulados para desenvolvimento
├── services/
│   ├── config.ts                      # Configurações da aplicação
│   └── dashboardService.ts            # Serviço para buscar dados
└── hooks/
    └── useDashboardData.ts            # Hook personalizado para gerenciar dados
```

## Sistema de Mock Data

### Como Funciona

O sistema foi projetado para facilitar a transição entre dados simulados (mock) e dados reais da API:

1. **Configuração**: No arquivo `services/config.ts`, existe uma flag `USE_API`
2. **Dados Mock**: Localizados em `data/mockData.ts`
3. **Serviço**: `dashboardService.ts` decide qual fonte usar baseado na configuração
4. **Hook**: `useDashboardData.ts` gerencia estados de loading, erro e dados

### Alternando entre Mock e API

Para alternar entre dados simulados e API real:

```typescript
// services/config.ts
export const APP_CONFIG = {
  USE_API: false, // Para usar mock data
  // USE_API: true, // Para usar API real
  API_BASE_URL: 'https://sua-api.com',
  MOCK_DELAY: 1000,
};
```

### Adicionando Novos Dados Mock

Para adicionar novos dados simulados:

```typescript
// data/mockData.ts
export const mockDashboardData = {
  // Adicione novos dados aqui
  newFeature: [
    {
      id: '1',
      name: 'Exemplo',
      value: 100
    }
  ]
};
```

### Implementando Nova Funcionalidade API

Quando a API estiver pronta:

1. **Atualize o serviço**:
```typescript
// services/dashboardService.ts
export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (APP_CONFIG.USE_API) {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/dashboard`);
    return await response.json();
  } else {
    // Mock data
    return mockDashboardData;
  }
};
```

2. **Altere a configuração**:
```typescript
// services/config.ts
USE_API: true
```

## Componentes

### Cards de Estatísticas
- Saldo Total
- Receitas do Mês  
- Gastos do Mês

### Gráficos
- **Atividade Semanal**: Gráfico de barras mostrando entradas e saídas por dia
- **Histórico de Saldo**: Gráfico de linha mostrando evolução do saldo
- **Gastos por Categoria**: Gráfico de rosca com distribuição por categoria

### Lista de Transações
- Últimas transações com ícones e valores coloridos
- Suporte a diferentes tipos (entrada/saída)

## Responsividade

O dashboard foi desenvolvido para funcionar tanto em:
- **Mobile**: Layout vertical com scroll
- **Web**: Layout em duas colunas quando há espaço suficiente

## Temas

Suporte completo a temas claro e escuro:
- Cores se adaptam automaticamente
- Componentes respeitam preferências do usuário
- Contraste adequado em ambos os temas

## Estados da Aplicação

### Loading
- Spinner personalizado com card
- Texto de carregamento contextual
- Refresh control para recarregar dados

### Erro
- Mensagem de erro amigável
- Botão para tentar novamente
- Fallback para dados mock em caso de falha da API

### Dados Carregados
- Interface completa com todos os componentes
- Animações suaves
- Interações responsivas

## Próximos Passos

Quando a API estiver pronta:

1. Implemente as rotas de backend
2. Ajuste os tipos TypeScript se necessário
3. Teste a integração
4. Altere `USE_API: true` na configuração
5. Remova dados mock se não precisar mais

## Desenvolvimento

Para adicionar novos recursos:

1. Crie componentes reutilizáveis em `components/`
2. Adicione dados mock em `data/mockData.ts`
3. Atualize o serviço em `services/dashboardService.ts`
4. Use o hook `useDashboardData` para gerenciar estado
5. Mantenha responsividade e suporte a temas 