// initialize Firebase — replace values with your actual project credentials
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAz9u38QIFfD87PUmiUq4eTR9MYAhhVcb8",
  authDomain: "finflow-bcde8.firebaseapp.com",
  databaseURL: "https://finflow-bcde8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "finflow-bcde8",
  storageBucket: "finflow-bcde8.firebasestorage.app",
  messagingSenderId: "247601486435",
  appId: "1:247601486435:web:a8b20bf90b1a530d0af656",
  measurementId: "G-4PQMZ0WDT8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
