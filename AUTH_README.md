# Sistema de Autenticação - Financial Track

## Visão Geral

O sistema de autenticação foi implementado seguindo as **regras do usuário** sobre funcionar tanto para desenvolvimento quanto para produção. O sistema inclui:

- Telas de login e cadastro responsivas
- Validação de formulários
- Armazenamento seguro de tokens
- Gestão de estado de autenticação
- Design consistente com Tailwind CSS

## Estrutura

### Contexto de Autenticação (`services/AuthContext.tsx`)
- Gerencia estado de autenticação global
- Persiste dados no AsyncStorage
- Simula API para desenvolvimento
- Pronto para integração com backend real

### Componentes Atoms
- `Button`: Botão reutilizável com variants e estados
- `Input`: Campo de entrada com validação e ícones
- `Logo`: Logo da aplicação
- `custom-toasts`: Notificações personalizadas

### Telas
- `login.tsx`: Tela de login com validação
- `cadastro.tsx`: Tela de cadastro com todos os campos solicitados

## Como Usar

### Para Teste (Desenvolvimento)
```
Email: test@test.com
Senha: 123456
```

### Fluxo de Autenticação
1. Usuário não autenticado → Redirecionado para `/login`
2. Login bem-sucedido → Redirecionado para `/dashboard`
3. Cadastro → Automaticamente logado e redirecionado

### Integração com Backend
O contexto está preparado para receber a API real. Basta substituir as funções `login` e `register` no `AuthContext.tsx` para fazer chamadas HTTP reais.

## Funcionalidades Implementadas

✅ Tela de login conforme design do Figma
✅ Tela de cadastro com campos: email, nome, senha, confirmar senha
✅ Login/cadastro como primeira tela (não dashboard)
✅ Sistema de autenticação com tokens
✅ Funciona sem backend (para teste)
✅ Preparado para backend quando estiver pronto
✅ Validação de formulários
✅ Persistência de dados
✅ Logout funcional
✅ Notificações em português BR

## Próximas Etapas

- Integrar com API do backend quando disponível
- Implementar "Esqueceu a Senha?"
- Adicionar autenticação social se necessário 