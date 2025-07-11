import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import PropertyCard from '../PropertyCard';
import listingsData from '../../data/listingsData'; // Import dummy data
import { FaRegBookmark } from 'react-icons/fa';

const Bookmarks = ({ user }) => {
  const [bookmarkedProps, setBookmarkedProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookmarks = useCallback(async () => {
    console.log("Bookmarks: fetchBookmarks called");
    setLoading(true);
    setError(''); // Clear any previous errors
    let bookmarkedIds = [];
    let properties = [];

    if (user) {
      console.log("Bookmarks: User is logged in:", user.uid);
      try {
        const bookmarksRef = collection(db, `users/${user.uid}/bookmarkedProperties`);
        const snapshot = await getDocs(bookmarksRef);
        bookmarkedIds = snapshot.docs.map(d => d.id);
        console.log("Bookmarks: Fetched Firestore bookmarkedIds:", bookmarkedIds);
      } catch (err) {
        console.warn("Bookmarks: Firestore bookmark fetch failed, falling back to local storage.", err);
        bookmarkedIds = JSON.parse(localStorage.getItem('localBookmarks') || '[]');
      }
    } else {
      console.log("Bookmarks: User not logged in, using local storage for bookmarks.");
      bookmarkedIds = JSON.parse(localStorage.getItem('localBookmarks') || '[]');
    }
    console.log("Bookmarks: Final bookmarkedIds before property fetch:", bookmarkedIds);

    if (bookmarkedIds.length > 0) {
      try {
        console.log("Bookmarks: Attempting to fetch properties from Firestore for bookmarked IDs.");
        const propertyPromises = bookmarkedIds.map(id => getDoc(doc(db, 'properties', id)));
        const docs = await Promise.all(propertyPromises);
        if (docs.every(d => !d.exists())) {
          console.warn("Bookmarks: No Firestore properties found for bookmarked IDs, falling back to local listingsData.");
          throw new Error('No Firestore properties found');
        }
        properties = docs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
        console.log("Bookmarks: Fetched properties from Firestore:", properties);
      } catch (err) {
        console.warn("Bookmarks: Firestore property fetch failed, falling back to local listingsData.", err);
        properties = listingsData.filter(p => bookmarkedIds.includes(p.id));
        console.log("Bookmarks: Fetched properties from local listingsData:", properties);
      }
    }

    setBookmarkedProps(properties);
    setLoading(false);
    console.log("Bookmarks: Loading set to false. Final bookmarkedProps:", properties);
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (propertyId) => {
    setError(''); // Clear any previous errors
    try {
      if (user) {
        await deleteDoc(doc(db, `users/${user.uid}/bookmarkedProperties`, propertyId));
      } else {
        // Not logged in, remove from local bookmarks
        let localBookmarks = new Set(JSON.parse(localStorage.getItem('localBookmarks') || '[]'));
        localBookmarks.delete(propertyId);
        localStorage.setItem('localBookmarks', JSON.stringify(Array.from(localBookmarks)));
      }
      setBookmarkedProps(prev => prev.filter(p => p.id !== propertyId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Failed to remove bookmark. Please try again.');
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
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-empty-state">
          <FaRegBookmark className="empty-state-icon" />
          <p className="empty-state-title">No Bookmarks Yet</p>
          <p className="empty-state-text">Start exploring properties and bookmark your favorites to see them here!</p>
          <button onClick={() => window.location.href = '/listings'} className="empty-state-btn">Browse Properties</button>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
