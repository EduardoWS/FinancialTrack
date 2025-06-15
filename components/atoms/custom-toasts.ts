import { Alert } from 'react-native';

export const successToast = (message: string, title: string = 'Sucesso') => {
  Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
};

export const errorToast = (message: string, title: string = 'Erro') => {
  Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
};

export const warningToast = (message: string, title: string = 'Atenção') => {
  Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
};

export const infoToast = (message: string, title: string = 'Informação') => {
  Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
}; 