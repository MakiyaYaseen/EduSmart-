// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrUUy4CoEX1rrDrK12o02thVKLDwFLhdI",
  authDomain: "my-lms-project-8a82f.firebaseapp.com",
  projectId: "my-lms-project-8a82f",
  storageBucket: "my-lms-project-8a82f.firebasestorage.app",
  messagingSenderId: "863635277399",
  appId: "1:863635277399:web:a08e9f9e8113fbfa3c4512"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}