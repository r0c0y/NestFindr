import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, googleProvider, githubProvider, db } from '../config/firebase';
import { useNotification } from "../context/NotificationContext";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification: addNotification } = useNotification();

  // Create user document in Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date().toISOString();

      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          lastLoginAt: createdAt,
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    } else {
      // Update last login time
      await updateDoc(userRef, {
        lastLoginAt: new Date().toISOString()
      });
    }

    // Fetch and set user profile
    const updatedSnapshot = await getDoc(userRef);
    setUserProfile(updatedSnapshot.data());
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(user, { displayName });
      
      // Create user document
      await createUserDocument(user, { displayName });
      
      // Send email verification
      await sendEmailVerification(user);
      
      addNotification('success', 'Account created successfully! Please verify your email.');
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(user);
      addNotification('success', 'Logged in successfully!');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await createUserDocument(user);
      addNotification('success', 'Logged in with Google successfully!');
      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Sign in with GitHub
  const signInWithGithub = async () => {
    try {
      const { user } = await signInWithPopup(auth, githubProvider);
      await createUserDocument(user);
      addNotification('success', 'Logged in with GitHub successfully!');
      return user;
    } catch (error) {
      console.error('GitHub sign in error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      addNotification('info', 'Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      addNotification('error', 'Error signing out');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      addNotification('success', 'Password reset email sent!');
    } catch (error) {
      console.error('Reset password error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');

      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(currentUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        });
      }

      // Update Firestore document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
      addNotification('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Update password
  const updateUserPassword = async (newPassword) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      await updatePassword(currentUser, newPassword);
      addNotification('success', 'Password updated successfully!');
    } catch (error) {
      console.error('Update password error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Reauthenticate user
  const reauthenticate = async (password) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      console.error('Reauthentication error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      // Delete user document from Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await deleteDoc(userRef);
      
      // Delete user from Firebase Auth
      await deleteUser(currentUser);
      
      addNotification('info', 'Account deleted successfully');
    } catch (error) {
      console.error('Delete account error:', error);
      addNotification('error', getErrorMessage(error));
      throw error;
    }
  };

  // Get error message from Firebase error
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by the browser. Please allow popups and try again.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (user) => {
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);
      
      if (userSnapshot.exists()) {
        const profile = userSnapshot.data();
        setUserProfile(profile);
        return profile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    signInWithGoogle,
    signInWithGithub,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
    reauthenticate,
    deleteUserAccount,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
