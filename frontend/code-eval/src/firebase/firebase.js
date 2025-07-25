// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPr1Y_-KZK_rZR14GoPu2rSkKn0BtdYDs",
  authDomain: "codeeval-de0cf.firebaseapp.com",
  projectId: "codeeval-de0cf",
  storageBucket: "codeeval-de0cf.firebasestorage.app",
  messagingSenderId: "577046306019",
  appId: "1:577046306019:web:0ee2817395668a1217b9d6",
  measurementId: "G-W3VR4C0RWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, auth};