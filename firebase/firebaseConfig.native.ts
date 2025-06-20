// Importe os módulos que você precisa DIRETAMENTE do @react-native-firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


// O app já foi inicializado nativamente pelos plugins no app.json.
// Agora você só precisa pegar a instância dos serviços.

// Exporta a instância do serviço de Autenticação
export const firebaseAuth = auth();

// Exporta a instância do serviço do Firestore
export const db = firestore();

// Se precisar de outros serviços, como o Storage:
// import storage from '@react-native-firebase/storage';
// export const firebaseStorage = storage();