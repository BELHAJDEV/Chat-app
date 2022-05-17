// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCkR9jDKnzrdMf3QtJyqt3hjqI12APZXlA",
  authDomain: "chat-app-23291.firebaseapp.com",
  projectId: "chat-app-23291",
  storageBucket: "chat-app-23291.appspot.com",
  messagingSenderId: "877340718485",
  appId: "1:877340718485:web:7159d027210302ac99729c"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth