// app/_layout.tsx

import { Stack } from 'expo-router';
import { AuthProvider } from '../services/AuthContext';
import { ThemeProvider } from '../services/ThemeContext';
import Toast from 'react-native-toast-message';
import "../styles/global.css"; 

export default function RootLayout() {
  return (
    // O AuthProvider precisa envolver TUDO para que o contexto
    // de autenticação esteja disponível em todas as rotas.
    <ThemeProvider>
      <AuthProvider>
        {/* Este Stack é o navegador raiz. Ele gerencia as duas
          principais seções do seu app: as telas de autenticação
          e as telas internas (com abas).
        */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>

        {/* O Toast fica aqui, como irmão do Stack, mas dentro do Provider.
          Assim, ele pode ser chamado de qualquer lugar e vai aparecer
          por cima da tela atual.
        */}
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}