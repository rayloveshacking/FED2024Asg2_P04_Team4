// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB-eOVPNHyKVYsZ_fFD4MTXIgtvs2XSOXs",
  authDomain: "login-18ccb.firebaseapp.com",
  projectId: "login-18ccb",
  storageBucket: "login-18ccb.firebasestorage.app",
  messagingSenderId: "1006476890126",
  appId: "1:1006476890126:web:32cf5d688c6a0c8ff9ac5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;