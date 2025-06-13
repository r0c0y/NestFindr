import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import PropertyCard from '../PropertyCard';
import listingsData from '../../data/listingsData'; // Import dummy data

const Bookmarks = () => {
  const user = auth.currentUser;
  const [bookmarkedProps, setBookmarkedProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [removeSuccess, setRemoveSuccess] = useState(null);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    let bookmarkedIds = [];
    let properties = [];

    if (user) {
      try {
        // Try Firestore bookmarks first
        const bookmarksRef = collection(db, `users/${user.uid}/bookmarkedProperties`);
        const snapshot = await getDocs(bookmarksRef);
        bookmarkedIds = snapshot.docs.map(d => d.id);
      } catch (err) {
        // If Firestore fails, fallback to local bookmarks
        bookmarkedIds = JSON.parse(localStorage.getItem('localBookmarks') || '[]');
      }
    } else {
      // Not logged in, fallback to local bookmarks
      bookmarkedIds = JSON.parse(localStorage.getItem('localBookmarks') || '[]');
    }

    // Try to fetch properties from Firestore, fallback to dummy data
    if (bookmarkedIds.length > 0) {
      try {
        // Try Firestore properties
        const propertyPromises = bookmarkedIds.map(id => getDoc(doc(db, 'properties', id)));
        const docs = await Promise.all(propertyPromises);
        // If all docs are empty, fallback to dummy data
        if (docs.every(d => !d.exists())) {
          throw new Error('No Firestore properties found');
        }
        properties = docs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        // Fallback to dummy data
        properties = listingsData.filter(p => bookmarkedIds.includes(p.id));
      }
    }

    setBookmarkedProps(properties);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (propertyId) => {
    try {
      setRemovingId(propertyId);
      if (user) {
        await deleteDoc(doc(db, `users/${user.uid}/bookmarkedProperties`, propertyId));
      } else {
        // Not logged in, remove from local bookmarks
        let localBookmarks = new Set(JSON.parse(localStorage.getItem('localBookmarks') || '[]'));
        localBookmarks.delete(propertyId);
        localStorage.setItem('localBookmarks', JSON.stringify(Array.from(localBookmarks)));
      }
      setBookmarkedProps(prev => prev.filter(p => p.id !== propertyId));
      setRemoveSuccess(propertyId);
      setTimeout(() => setRemoveSuccess(null), 3000);
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Failed to remove bookmark. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return (
    <div className="dashboard-loading">
      <p>Loading your bookmarked properties...</p>
    </div>
  );

  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={fetchBookmarks} className="dashboard-btn">Try Again</button>
    </div>
  );

  return (
    <div>
      <h3 className="bookmarks-title">My Bookmarked Properties</h3>
      {bookmarkedProps.length > 0 ? (
        <div className="dashboard-properties-grid">
          {bookmarkedProps.map(prop => (
            <PropertyCard
              key={prop.id}
              {...prop}
              isDashboardView={true}
              onRemoveBookmark={() => handleRemoveBookmark(prop.id)}
              bookmarkLoading={removingId === prop.id}
              bookmarkRemoved={removeSuccess === prop.id}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-empty">
          <p>You haven't saved any properties yet.</p>
          <p className="dashboard-empty-sub">Properties you bookmark will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
