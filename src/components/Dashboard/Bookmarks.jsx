import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropertyCard from '../PropertyCard';
import { removeFavorite } from '../../store/favoritesSlice';
import { FaRegBookmark } from 'react-icons/fa';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const allProperties = useSelector((state) => state.properties.listings);

  const [bookmarkedProps, setBookmarkedProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      // Filter all properties to find the ones that are bookmarked
      const fetchedBookmarkedProps = allProperties.filter(property => 
        favorites.some(fav => fav.id === property.id)
      );
      setBookmarkedProps(fetchedBookmarkedProps);
    } catch (err) {
      console.error("Error fetching bookmarked properties:", err);
      setError("Failed to load bookmarked properties.");
    } finally {
      setLoading(false);
    }
  }, [favorites, allProperties]);

  const handleRemoveBookmark = useCallback((propertyId) => {
    dispatch(removeFavorite({ id: propertyId }));
  }, [dispatch]);

  if (loading) return (
    <div className="dashboard-loading">
      <p>Loading your bookmarked properties...</p>
    </div>
  );

  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="dashboard-btn">Try Again</button>
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