import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDigy7xP3aBHNGrT3GckAWQ9fg3L-viLYE",
  authDomain: "chat-98055.firebaseapp.com",
  projectId: "chat-98055",
  storageBucket: "chat-98055.appspot.com",
  messagingSenderId: "749718557502",
  appId: "1:749718557502:web:8878636ea61b725bd8926f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore();
export const storage=getStorage();