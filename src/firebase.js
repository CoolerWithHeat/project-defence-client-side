import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBkdui6uYxcb8MHHpCnQgD7hYcuDMMDvZg",
  authDomain: "estore-83429.firebaseapp.com",
  projectId: "estore-83429",
  storageBucket: "estore-83429.appspot.com",
  messagingSenderId: "419517825122",
  appId: "1:419517825122:web:8d19c0627ba56efacd513b",
  measurementId: "G-YPTBVN0S8C"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };