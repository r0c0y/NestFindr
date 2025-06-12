import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWNBET41cFPLyrmLAfp11K0p3C-uIUmng",
  authDomain: "nestfindr-40a79.firebaseapp.com",
  projectId: "nestfindr-40a79",
  storageBucket: "nestfindr-40a79.firebasestorage.app",
  messagingSenderId: "700489606347",
  appId: "1:700489606347:web:24537c83ac938b2950a74e",
  measurementId: "G-43HVQGTK3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
