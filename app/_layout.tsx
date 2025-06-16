import { Stack } from 'expo-router';
import { AuthProvider } from '../services/AuthContext';
import { ThemeProvider } from '../services/ThemeContext';
import "../styles/global.css";

export default function RootLayout() {
  // O Stack.Screen com name="(tabs)" remove o cabeçalho do layout de abas
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}