// ...existing imports...
import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import '../styles/Listings.css';

// Define dummyProperties here
const dummyProperties = Array.from({ length: 180 }, (_, i) => ({
  id: String(i + 1),
  image: `https://via.placeholder.com/300x200?text=Property+${i + 1}`,
  title: `Property ${i + 1}`,
  address: `Sector ${i + 1}, City`,
  price: 5000000 + i * 100000,
  date: `2025-05-${(i % 30) + 1 < 10 ? '0' : ''}${(i % 30) + 1}`,
}));

const Listings = () => {
  const [user] = useAuthState(auth);
  const [properties] = useState(dummyProperties); // Remove setProperties to avoid unused var warning
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);
  const [bookmarkSavedId, setBookmarkSavedId] = useState(null);
  const [bookmarkRemovedId, setBookmarkRemovedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;

  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }
    const fetchBookmarks = async () => {
      const bookmarksQuery = await getDocs(collection(db, `users/${user.uid}/bookmarkedProperties`));
      setBookmarkedIds(new Set(bookmarksQuery.docs.map(doc => doc.id)));
    };
    fetchBookmarks();
  }, [user]);

  const handleBookmarkToggle = async (propertyId) => {
    if (!user) {
      alert("Please log in to bookmark properties!");
      return;
    }
    setBookmarkLoadingId(propertyId);
    setBookmarkSavedId(null);
    setBookmarkRemovedId(null);
    const bookmarkRef = doc(db, `users/${user.uid}/bookmarkedProperties`, propertyId);
    const newBookmarkedIds = new Set(bookmarkedIds);
    if (newBookmarkedIds.has(propertyId)) {
      newBookmarkedIds.delete(propertyId);
      await deleteDoc(bookmarkRef);
      setBookmarkedIds(newBookmarkedIds);
      setBookmarkLoadingId(null);
      setBookmarkRemovedId(propertyId);
      setTimeout(() => setBookmarkRemovedId(null), 2500);
    } else {
      newBookmarkedIds.add(propertyId);
      await setDoc(bookmarkRef, { bookmarkedAt: new Date() });
      setBookmarkedIds(newBookmarkedIds);
      setBookmarkLoadingId(null);
      setBookmarkSavedId(propertyId);
      setTimeout(() => setBookmarkSavedId(null), 2500);
    }
  };

  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = properties.slice(startIndex, startIndex + propertiesPerPage);

  return (
    <div className="listings-container">
      <h1 className="listings-title">Property Listings</h1>
      <div className="properties-grid">
        {currentProperties.map((prop) => (
          <PropertyCard
            key={prop.id}
            {...prop}
            isBookmarked={bookmarkedIds.has(String(prop.id))}
            onBookmark={() => handleBookmarkToggle(String(prop.id))}
            bookmarkLoading={bookmarkLoadingId === String(prop.id)}
            bookmarkSaved={bookmarkSavedId === String(prop.id)}
            bookmarkRemoved={bookmarkRemovedId === String(prop.id)}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Listings;
