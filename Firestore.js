import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import necessary Firestore functions
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD4zBhDHXkWGXlFwJYngEjcIBytnMWNibY",
    authDomain: "test-c6515.firebaseapp.com",
    projectId: "test-c6515",
    storageBucket: "test-c6515.appspot.com",
    messagingSenderId: "461362651524",
    appId: "1:461362651524:web:80326a46403ca0ce53bdd1"
  };
  


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };
