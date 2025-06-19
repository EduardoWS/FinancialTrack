import Toast from 'react-native-toast-message';

export const successToast = (message: string, title: string = 'Sucesso') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });
};

export const errorToast = (message: string, title: string = 'Erro') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
  });
};

export const warningToast = (message: string, title: string = 'Atenção') => {
  Toast.show({
    type: 'info', // react-native-toast-message doesn't have a 'warning' type by default
    text1: title,
    text2: message,
  });
};

export const infoToast = (message: string, title: string = 'Informação') => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
  });
}; 