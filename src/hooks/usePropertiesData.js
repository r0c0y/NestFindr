import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import listingsData from '../data/listingsData';

/**
 * Custom hook to handle property data from both Firestore and local storage
 * Provides fallback to local data when Firestore is unavailable
 * @returns {Object} Properties data and methods
 */
const usePropertiesData = () => {
  const [properties, setProperties] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [dataSource, setDataSource] = useState('local'); // 'local' or 'firestore'

  // Initialize - check auth state and load appropriate data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Attempt to load data based on authentication state
      loadProperties(currentUser);
      loadBookmarks(currentUser);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Load properties from Firestore or fall back to local data
   * @param {Object} currentUser - Firebase auth user object
   */
  const loadProperties = async (currentUser) => {
    setLoading(true);
    setError(null);
    
    try {
      // If user is authenticated and db is available, try Firestore first
      if (currentUser && db) {
        try {
          const propertiesCollection = collection(db, 'properties');
          const propertiesSnapshot = await getDocs(propertiesCollection);
          
          if (!propertiesSnapshot.empty) {
            const propertiesData = propertiesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Ensure date is properly formatted for display
              date: doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'
            }));
            
            setProperties(propertiesData);
            setDataSource('firestore');
            setLoading(false);
            return;
          }
        } catch (firestoreError) {
          console.warn('Failed to fetch from Firestore, falling back to local data:', firestoreError);
          // Continue to local data fallback
        }
      }
      
      // Fallback to local data (dummy data)
      setProperties(listingsData);
      setDataSource('local');
      setLoading(false);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties. Please try again later.');
      setProperties([]); // Clear properties on error
      setLoading(false);
    }
  };

  /**
   * Load bookmarks from Firestore (if authenticated) and merge with localStorage
   * @param {Object} currentUser - Firebase auth user object
   */
  const loadBookmarks = async (currentUser) => {
    try {
      // Always load bookmarks from localStorage first
      const localBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      
      // If user is authenticated, try to get bookmarks from Firestore and merge
      if (currentUser && db) {
        try {
          const userDoc = doc(db, 'users', currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const firestoreBookmarks = userData.bookmarks || [];
            
            // Merge bookmarks, prioritizing Firestore data but keeping local ones
            // that aren't yet in Firestore
            const mergedBookmarks = [...new Set([...firestoreBookmarks, ...localBookmarks])];
            
            // Update localStorage with merged bookmarks
            localStorage.setItem('bookmarks', JSON.stringify(mergedBookmarks));
            
            setBookmarks(mergedBookmarks);
            return;
          }
        } catch (firestoreError) {
          console.warn('Failed to fetch bookmarks from Firestore:', firestoreError);
          // Continue to use local bookmarks
        }
      }
      
      // If we reach here, just use local bookmarks
      setBookmarks(localBookmarks);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      setBookmarks([]);
    }
  };

  /**
   * Toggle bookmark status for a property
   * @param {string} propertyId - ID of the property to toggle
   * @returns {Promise<boolean>} Success status
   */
  const toggleBookmark = async (propertyId) => {
    try {
      const isCurrentlyBookmarked = bookmarks.includes(propertyId);
      let updatedBookmarks;
      
      if (isCurrentlyBookmarked) {
        // Remove from bookmarks
        updatedBookmarks = bookmarks.filter(id => id !== propertyId);
      } else {
        // Add to bookmarks
        updatedBookmarks = [...bookmarks, propertyId];
      }
      
      // Update local state
      setBookmarks(updatedBookmarks);
      
      // Always update localStorage
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      
      // If user is authenticated, update Firestore
      if (user && db) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, { bookmarks: updatedBookmarks }, { merge: true });
        } catch (firestoreError) {
          console.warn('Failed to update bookmarks in Firestore:', firestoreError);
          // Continue without failing the operation
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      return false;
    }
  };

  /**
   * Get all bookmarked properties
   * @returns {Array} Array of bookmarked property objects
   */
  const getBookmarkedProperties = () => {
    if (!properties.length || !bookmarks.length) return [];
    
    return properties.filter(property => bookmarks.includes(property.id));
  };

  /**
   * Check if a property is bookmarked
   * @param {string} propertyId - ID of the property to check
   * @returns {boolean} True if property is bookmarked
   */
  const isBookmarked = (propertyId) => {
    return bookmarks.includes(propertyId);
  };

  /**
   * Remove a property from bookmarks
   * @param {string} propertyId - ID of the property to remove
   */
  const removeBookmark = async (propertyId) => {
    return toggleBookmark(propertyId);
  };

  /**
   * Get a single property by ID
   * @param {string} propertyId - ID of the property to get
   * @returns {Object|null} Property object or null if not found
   */
  const getPropertyById = (propertyId) => {
    return properties.find(property => property.id === propertyId) || null;
  };

  return {
    properties,
    loading,
    error,
    bookmarks,
    dataSource,
    toggleBookmark,
    isBookmarked,
    getBookmarkedProperties,
    removeBookmark,
    getPropertyById,
    refreshData: () => {
      loadProperties(user);
      loadBookmarks(user);
    }
  };
};

export default usePropertiesData;

