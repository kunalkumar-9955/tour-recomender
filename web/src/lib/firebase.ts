import { initializeApp, getApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tourrecommender-8196c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tourrecommender-8196c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tourrecommender-8196c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "965160964462",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:965160964462:web:c2580684171d12e41a717f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HH485Z4NRG",
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
