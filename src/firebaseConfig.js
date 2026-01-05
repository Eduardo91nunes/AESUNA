import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEADc-oVW0ZOJKqXEnJTQ5ZCXmRP8vCaU",
  authDomain: "portal-aesuna.firebaseapp.com",
  projectId: "portal-aesuna",
  storageBucket: "portal-aesuna.appspot.com", // ✅ corrigido
  messagingSenderId: "947460596965",
  appId: "1:947460596965:web:dc6de83d03e148682a600c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
