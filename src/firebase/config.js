// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCFrZcSYKf2DmHACttcZZfmM0xDZSM7pgE",
    authDomain: "orbital-app-ad114.firebaseapp.com",
    projectId: "orbital-app-ad114",
    storageBucket: "orbital-app-ad114.appspot.com",
    messagingSenderId: "973911068595",
    appId: "1:973911068595:web:ed027e65f4e15c680945c6",
    measurementId:"G-JWFD0D3FEG",
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
