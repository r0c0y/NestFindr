import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDWNBET41cFPLyrmLAfp11K0p3C-uIUmng",
  authDomain: "nestfindr-40a79.firebaseapp.com",
  projectId: "nestfindr-40a79",
  storageBucket: "nestfindr-40a79.firebasestorage.app",
  messagingSenderId: "700489606347",
  appId: "1:700489606347:web:24537c83ac938b2950a74e",
  measurementId: "G-43HVQGTK3Z"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

githubProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
