import { Stack } from 'expo-router';
import "../styles/global.css";

export default function RootLayout() {
  // O Stack.Screen com name="(tabs)" remove o cabeçalho do layout de abas
  return <Stack screenOptions={{ headerShown: false }} />;
}