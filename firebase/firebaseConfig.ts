import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1) Sua configuração do Firebase (pega das variáveis de ambiente)
const firebaseConfig = {
  apiKey: Constants.expoConfig!.extra!.EXPO_PUBLIC_API_KEY,
  authDomain: Constants.expoConfig!.extra!.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: Constants.expoConfig!.extra!.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: Constants.expoConfig!.extra!.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig!.extra!.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig!.extra!.EXPO_PUBLIC_APP_ID,
};

// 2) Inicializa o app uma vez só
const app = initializeApp(firebaseConfig);

// 3) Inicializa o Auth de forma diferente conforme a plataforma
export const auth =
  Platform.OS === 'web'
    ? // no web, use o getAuth padrão
      getAuth(app)
    : // no mobile, usa AsyncStorage para persistência
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

// 4) Firestore (mesmo nos dois casos)
export const db = getFirestore(app);
