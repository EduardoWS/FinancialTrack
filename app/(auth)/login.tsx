import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Logo } from '../../components/atoms/Logo';
import { useAuth } from '../../services/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; senha?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setLoginError(null); // Limpa erros anteriores
    if (!validateForm()) {
      return;
    }

    const result = await login(email.trim(), senha);
    
    if (result.success) {
      router.replace('/dashboard');
    } else {
      setLoginError(result.error || 'Ocorreu um erro ao fazer login.');
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center px-8 py-12">
          <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
            <Logo size="large" />
            
            {/* {loginError && (
              <View className="bg-red-100 p-3 rounded-lg mb-4">
                <Text className="text-red-700 text-center">{loginError}</Text>
              </View>
            )} */}
            
            <View className="mb-6">
              <Input
                label="Email"
                placeholder="Digite seu email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setLoginError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail"
                error={errors.email || loginError}
              />
              
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  setLoginError(null);
                }}
                isPassword
                icon="lock-closed"
                error={errors.senha || loginError}
              />
            </View>

            <View className="mb-6">
              <TouchableOpacity className="mb-4">
                <Text className="text-blue-600 text-sm text-right">
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>

              <Button
                title="Login"
                onPress={handleLogin}
                isLoading={isLoading}
                disabled={isLoading}
                size="large"
              />
            </View>

            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-sm">
                Não tem uma conta?{' '}
              </Text>
              <Link href="/cadastro" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 text-sm font-semibold">
                    Cadastre-se
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Informações para teste */}
            <View className="mt-8 p-4 bg-blue-50 rounded-lg">
              <Text className="text-blue-800 text-xs font-semibold mb-1">
                Para testar (desenvolvimento):
              </Text>
              <Text className="text-blue-700 text-xs">
                Email: test@test.com
              </Text>
              <Text className="text-blue-700 text-xs">
                Senha: 123456
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
