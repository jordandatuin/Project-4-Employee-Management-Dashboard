// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = 
{
  apiKey: "AIzaSyDfjheyixnyJ3vojJ6RHY6pjIk72gLbeXY",
  authDomain: "db-ema.firebaseapp.com",
  projectId: "db-ema",
  storageBucket: "db-ema.appspot.com",
  messagingSenderId: "777182944474",
  appId: "1:777182944474:web:52e27f7c9bdc86a51019e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;