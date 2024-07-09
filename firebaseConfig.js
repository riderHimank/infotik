import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

//! REPLACE VALUES BELOW WITH YOUR OWN FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBBKy_G2-plnwY90N3FLkeb1kOkITnpanM",
  authDomain: "infotik-617ac.firebaseapp.com",
  projectId: "infotik-617ac",
  storageBucket: "infotik-617ac.appspot.com",
  messagingSenderId: "634179897850",
  appId: "1:634179897850:web:da80b94455cb989a903c43",
  measurementId: "G-4DEEMPDK7V",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
const isWeb = Platform.OS === "web";
const authPersistence = isWeb
  ? browserLocalPersistence
  : getReactNativePersistence(ReactNativeAsyncStorage);

// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: authPersistence,
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const GOOGLE_CLIENT_ID =
  "57901544761-64esnkm561dt0kpco5770aa8rjafo0lg.apps.googleusercontent.com";
