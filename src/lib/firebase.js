// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAz86C_CYgNdQhoLxeoVq09D1qe24kMpJY',
  authDomain: 'tuntas-198d6.firebaseapp.com',
  projectId: 'tuntas-198d6',
  storageBucket: 'tuntas-198d6.firebasestorage.app',
  messagingSenderId: '152197925158',
  appId: '1:152197925158:web:f81b9b1e15765a6bc019e7'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
