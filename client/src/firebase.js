// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "realestate-91e64.firebaseapp.com",
  projectId: "realestate-91e64",
  storageBucket: "realestate-91e64.appspot.com",
  messagingSenderId: "995920571752",
  appId: "1:995920571752:web:e68c510cf648f7832a3add"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);