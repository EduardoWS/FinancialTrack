import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { errorToast, successToast } from '../../components/atoms/custom-toasts';
import { Input } from '../../components/atoms/Input';
import { Logo } from '../../components/atoms/Logo';
import { useAuth } from '../../services/AuthContext';

export default function CadastroScreen() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errors, setErrors] = useState<{ 
    email?: string; 
    nome?: string; 
    senha?: string; 
    confirmarSenha?: string;
  }>({});
  const { register, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { 
      email?: string; 
      nome?: string; 
      senha?: string; 
      confirmarSenha?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCadastro = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await register(email.trim(), nome.trim(), senha);
    
    if (success) {
      successToast('Conta criada com sucesso!');
      router.replace('/dashboard');
    } else {
      errorToast('Erro ao criar conta. Tente novamente.');
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
            
            <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
              Criar Conta
            </Text>
            
            <View className="mb-6">
              <Input
                label="Nome"
                placeholder="Digite seu nome completo"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                icon="person"
                error={errors.nome}
              />

              <Input
                label="Email"
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail"
                error={errors.email}
              />
              
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={setSenha}
                isPassword
                icon="lock-closed"
                error={errors.senha}
              />

              <Input
                label="Confirmar Senha"
                placeholder="Confirme sua senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                isPassword
                icon="lock-closed"
                error={errors.confirmarSenha}
              />
            </View>

            <View className="mb-6">
              <Button
                title="Criar Conta"
                onPress={handleCadastro}
                isLoading={isLoading}
                disabled={isLoading}
                size="large"
              />
            </View>

            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-sm">
                Já tem uma conta?{' '}
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 text-sm font-semibold">
                    Faça login
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
