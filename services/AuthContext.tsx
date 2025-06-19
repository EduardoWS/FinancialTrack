import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { APP_CONFIG } from './config';

interface User {
  id: string;
  email: string;
  nome: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, nome: string, senha: string) => Promise<{ success: boolean; error?: string }>;
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

  const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!APP_CONFIG.USE_API) {
        // MOCK LOGIN
        return await new Promise((resolve) => {
          setTimeout(async () => {
            if (email === 'test@test.com' && senha === '123456') {
              const loggedInUser: User = {
                id: 'mock-user-id',
                email: 'test@test.com',
                nome: 'Usuário de Teste',
              };
              const sessionToken = 'mock-session-token';

              await AsyncStorage.setItem('@auth_token', sessionToken);
              await AsyncStorage.setItem('@auth_user', JSON.stringify(loggedInUser));

              setUser(loggedInUser);
              setToken(sessionToken);
              resolve({ success: true });
            } else {
              resolve({ success: false, error: 'Email ou senha inválidos (mock).' });
            }
          }, APP_CONFIG.MOCK_DELAY);
        });
      }

      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', senha);

      const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200 && response.data.session) {
        const sessionToken = response.data.session;

        // ATENÇÃO: O backend não retorna o nome do usuário no login.
        // Usando um nome genérico. O nome real só é obtido no cadastro.
        const loggedInUser: User = {
          id: email,
          email: email,
          nome: 'Usuário',
        };

        await AsyncStorage.setItem('@auth_token', sessionToken);
        await AsyncStorage.setItem('@auth_user', JSON.stringify(loggedInUser));

        setUser(loggedInUser);
        setToken(sessionToken);
        return { success: true };
      }

      return { success: false, error: 'Ocorreu um erro desconhecido.' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          return { success: false, error: 'Email ou senha incorretos. Tente novamente.' };
        }
      }
      console.error('Erro no login:', error);
      return { success: false, error: 'Não foi possível conectar ao servidor. Verifique sua conexão.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, nome: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!APP_CONFIG.USE_API) {
        // MOCK REGISTER
        return await new Promise((resolve) => {
          setTimeout(async () => {
            if (email === 'test@test.com') {
              resolve({ success: false, error: 'Este email já está cadastrado (mock).' });
            } else {
              const registeredUser: User = {
                id: `mock-id-${email}`,
                email,
                nome,
              };
              const sessionToken = 'mock-session-token-register';
              await AsyncStorage.setItem('@auth_token', sessionToken);
              await AsyncStorage.setItem('@auth_user', JSON.stringify(registeredUser));
              setUser(registeredUser);
              setToken(sessionToken);
              resolve({ success: true });
            }
          }, APP_CONFIG.MOCK_DELAY);
        });
      }

      const registerParams = new URLSearchParams();
      registerParams.append('email', email);
      registerParams.append('user', nome);
      registerParams.append('password', senha);

      await axios.post(
        `${APP_CONFIG.API_BASE_URL}/cria_user`,
        registerParams,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Se o cadastro foi bem-sucedido (não lançou erro), faz o login
      const loginResult = await login(email, senha);
      if (loginResult.success) {
        const registeredUser: User = {
          id: email,
          email: email,
          nome: nome,
        };
        await AsyncStorage.setItem('@auth_user', JSON.stringify(registeredUser));
        setUser(registeredUser);
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Cadastro realizado, mas o login automático falhou. Tente fazer login manualmente.',
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          return { success: false, error: 'Este email já está cadastrado.' };
        }
      }
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Não foi possível conectar ao servidor. Verifique sua conexão.' };
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