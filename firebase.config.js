// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKhB8WGz-HrxjnC21CdCG3132FhF3V6E4",
  authDomain: "my-database-type-shit.firebaseapp.com",
  projectId: "my-database-type-shit",
  storageBucket: "my-database-type-shit.firebasestorage.app",
  messagingSenderId: "1048911574213",
  appId: "1:1048911574213:web:393f8d8af3b5dbfca82cac",
  measurementId: "G-S9H5F9N6ZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);