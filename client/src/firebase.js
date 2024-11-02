// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "engineering-blog-8df1f.firebaseapp.com",
  projectId: "engineering-blog-8df1f",
  storageBucket: "engineering-blog-8df1f.appspot.com",
  messagingSenderId: "586433323366",
  appId: "1:586433323366:web:908f4398dad99738e128a7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);