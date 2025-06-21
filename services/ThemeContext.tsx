import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Contexto para forçar tema específico (usado nas telas de auth)
interface ForceThemeContextType {
  forcedTheme: Theme | null;
  setForcedTheme: (theme: Theme | null) => void;
}

const ForceThemeContext = createContext<ForceThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  const forceContext = useContext(ForceThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  // Se há um tema forçado, usa ele; caso contrário, usa o tema normal
  const effectiveTheme = forceContext?.forcedTheme || context.theme;
  
  return {
    ...context,
    theme: effectiveTheme
  };
}

export function useForceTheme() {
  const context = useContext(ForceThemeContext);
  if (context === undefined) {
    throw new Error('useForceTheme deve ser usado dentro de um ForceThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

interface ForceThemeProviderProps {
  children: ReactNode;
  forceTheme?: Theme | null;
}

// Provider para forçar tema específico
export function ForceThemeProvider({ children, forceTheme = null }: ForceThemeProviderProps) {
  const [forcedTheme, setForcedTheme] = useState<Theme | null>(forceTheme);

  useEffect(() => {
    setForcedTheme(forceTheme);
  }, [forceTheme]);

  const value = {
    forcedTheme,
    setForcedTheme
  };

  return (
    <ForceThemeContext.Provider value={value}>
      {children}
    </ForceThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>('light');

  // Detecta o tema do sistema
  const getSystemTheme = (): Theme => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  };

  // Atualiza o tema atual baseado no modo selecionado
  const updateCurrentTheme = (mode: ThemeMode) => {
    let newTheme: Theme;
    
    switch (mode) {
      case 'dark':
        newTheme = 'dark';
        break;
      case 'light':
        newTheme = 'light';
        break;
      case 'system':
        newTheme = getSystemTheme();
        break;
      default:
        newTheme = 'light';
    }
    
    setTheme(newTheme);
  };

  // Carrega tema salvo ao inicializar
  useEffect(() => {
    loadStoredTheme();
  }, []);

  // Escuta mudanças no tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription?.remove();
  }, [themeMode]);

  const loadStoredTheme = async () => {
    try {
      const storedThemeMode = await AsyncStorage.getItem('@theme_mode');
      if (storedThemeMode && ['light', 'dark', 'system'].includes(storedThemeMode)) {
        const mode = storedThemeMode as ThemeMode;
        setThemeModeState(mode);
        updateCurrentTheme(mode);
      } else {
        // Padrão: sistema
        updateCurrentTheme('system');
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      updateCurrentTheme('system');
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      updateCurrentTheme(mode);
      await AsyncStorage.setItem('@theme_mode', mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  // Função para alternar entre os temas (para uso futuro)
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const value = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 