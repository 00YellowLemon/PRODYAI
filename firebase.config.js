import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Pe53e

const firebaseConfig = {
  apiKey: "AIzaSyBKhB8WGz-HrxjnC21CdCG3132FhF3V6E4",
  authDomain: "my-database-type-shit.firebaseapp.com",
  projectId: "my-database-type-shit",
  storageBucket: "my-database-type-shit.firebasestorage.app",
  messagingSenderId: "1048911574213",
  appId: "1:1048911574213:web:393f8d8af3b5dbfca82cac",
  measurementId: "G-S9H5F9N6ZN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Pe53e

export { auth }; // Pe53e
