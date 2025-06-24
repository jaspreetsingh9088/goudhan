// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
 
 
const firebaseConfig = {
  apiKey: "AIzaSyDcNhrN-644NumsH_QI_02oM4I6a9U8qTM",
  authDomain: "goudhan-af647.firebaseapp.com",
  projectId: "goudhan-af647",
  storageBucket: "goudhan-af647.firebasestorage.app",
  messagingSenderId: "612596250429",
  appId: "1:612596250429:web:18cf19e6c3e551c20e3754",
  measurementId: "G-Q5NNFC5KM4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);