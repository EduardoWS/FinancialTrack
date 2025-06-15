import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  nome: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (email: string, nome: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há token salvo no AsyncStorage ao inicializar
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@auth_token');
      const storedUser = await AsyncStorage.getItem('@auth_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação armazenada:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Substituir por chamada real da API quando o backend estiver pronto
      // Por enquanto, simulamos o login para desenvolvimento
      if (email === 'test@test.com' && senha === '123456') {
        const mockUser: User = {
          id: '1',
          email: email,
          nome: 'Usuário Teste'
        };
        const mockToken = 'mock_token_' + Date.now();
        
        await AsyncStorage.setItem('@auth_token', mockToken);
        await AsyncStorage.setItem('@auth_user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
        return true;
      }
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return false;
      
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, nome: string, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Substituir por chamada real da API quando o backend estiver pronto
      // Por enquanto, simulamos o cadastro para desenvolvimento
      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        nome: nome
      };
      const mockToken = 'mock_token_' + Date.now();
      
      await AsyncStorage.setItem('@auth_token', mockToken);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setToken(mockToken);
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@auth_user');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 