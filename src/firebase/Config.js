import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEAAhg6cK-7BYnQBnwrku4P-BCzIojQgM",
  authDomain: "react-quickstock.firebaseapp.com",
  projectId: "react-quickstock",
  storageBucket: "react-quickstock.firebasestorage.app",
  messagingSenderId: "275407825000",
  appId: "1:275407825000:web:c46cfe0cb75d0ef2eeb3dd",
  measurementId: "G-KF7NDD4LDJ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
