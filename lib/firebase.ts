// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration pulled from env variables
const firebaseConfig = {
    apiKey: "AIzaSyBKhB8WGz-HrxjnC21CdCG3132FhF3V6E4",
    authDomain: "my-database-type-shit.firebaseapp.com",
    projectId: "my-database-type-shit",
    storageBucket: "my-database-type-shit.firebasestorage.app",
    messagingSenderId: "1048911574213",
    appId: "1:1048911574213:web:393f8d8af3b5dbfca82cac",
    measurementId: "G-S9H5F9N6ZN"
  };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
