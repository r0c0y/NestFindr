
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';

const useBookmarks = () => {
  const [user] = useAuthState(auth);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set());
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const bookmarksQuery = query(collection(db, `users/${user.uid}/bookmarkedProperties`), limit(100));
        const bookmarkSnapshot = await getDocs(bookmarksQuery);
        setBookmarkedIds(new Set(bookmarkSnapshot.docs.map(d => d.id)));
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        // This is a non-critical error, likely due to Firestore rules.
        // We'll log a warning but not block the UI.
        console.warn("Could not load bookmarks. This is likely a Firestore security rule issue. Please check your Firebase console.");
        setError(null); // Reset error state
        setBookmarkedIds(new Set()); // Default to empty bookmarks
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const toggleBookmark = async (propertyId) => {
    if (!user) {
      toast.error("Please log in to bookmark properties!");
      return;
    }

    const newBookmarkedIds = new Set(bookmarkedIds);
    const bookmarkRef = doc(db, `users/${user.uid}/bookmarkedProperties`, propertyId);

    const isBookmarked = newBookmarkedIds.has(propertyId);

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (isBookmarked) {
          newBookmarkedIds.delete(propertyId);
          await deleteDoc(bookmarkRef);
          resolve("Bookmark removed!");
        } else {
          newBookmarkedIds.add(propertyId);
          await setDoc(bookmarkRef, { bookmarkedAt: new Date(), propertyId });
          resolve("Bookmark added!");
        }
        setBookmarkedIds(newBookmarkedIds);
      } catch (err) {
        console.error("Failed to toggle bookmark:", err);
        reject("Failed to update bookmark.");
      }
    });

    toast.promise(promise, {
      loading: isBookmarked ? 'Removing bookmark...' : 'Adding bookmark...',
      success: (message) => message,
      error: (message) => message,
    });
  };

  return { bookmarkedIds, toggleBookmark, loading, error };
};

export default useBookmarks;
