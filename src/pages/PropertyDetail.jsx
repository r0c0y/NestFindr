import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookmark, FaCalculator, FaListUl, FaPhone, FaRegBookmark, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { addToCompare } from '../store/comparisonSlice';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import '../styles/PropertyDetail.css'; // You'll need to create this CSS file

const formatCurrency = (value) => {
  if (value >= 10000000) { // 1 Crore = 10,000,000
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) { // 1 Lakh = 100,000
    return `₹${(value / 100000).toFixed(2)} Lakhs`;
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProperties = useSelector((state) => state.properties.listings);
  const favorites = useSelector((state) => state.favorites.favorites);
  const compareList = useSelector((state) => state.comparison.compareList);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const foundProperty = allProperties.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
      setLoading(false);
    } else {
      setError('Property not found in Redux store.');
      setLoading(false);
    }
  }, [id, allProperties]);

  const handleBookmarkToggle = () => {
    if (!user) {
      addNotification('Please login to bookmark properties', 'warning');
      return;
    }
    
    if (property) {
      const isCurrentlyBookmarked = favorites.some(fav => fav.id === property.id);
      if (isCurrentlyBookmarked) {
        dispatch(removeFavorite(property));
        addNotification('Property removed from bookmarks', 'success');
      } else {
        dispatch(addFavorite(property));
        addNotification('Property bookmarked successfully', 'success');
      }
    }
  };

  const handleCompareClick = () => {
    if (!user) {
      addNotification('Please login to compare properties', 'warning');
      return;
    }
    
    if (property) {
      const isCurrentlyInCompare = compareList.some(item => item.id === property.id);
      if (!isCurrentlyInCompare) {
        if (compareList.length >= 4) {
          addNotification('You can only compare up to 4 properties at a time', 'warning');
          return;
        }
        dispatch(addToCompare({
          id: property.id,
          image: property.imageUrl || property.image,
          title: property.title,
          location: property.address,
          price: property.price,
          type: property.type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
        }));
        addNotification('Property added to comparison list', 'success');
      } else {
        addNotification('Property is already in comparison list', 'info');
      }
    }
  };

  const handleCalculateClick = () => {
    if (property) {
      navigate(`/calculator?price=${property.price}&property=${encodeURIComponent(property.title)}`);
    }
  };

  const handleVirtualTourClick = () => {
    if (!user) {
      addNotification('Please login to access virtual tours', 'warning');
      return;
    }
    // For now, just show a notification - you can implement actual virtual tour later
    addNotification('Virtual tour feature coming soon!', 'info');
  };

  if (loading) {
    return <div className="property-detail-container">Loading property details...</div>;
  }

  if (error) {
    return <div className="property-detail-container error">Error: {error}</div>;
  }

  if (!property) {
    return <div className="property-detail-container">Property not found.</div>;
  }

  const isBookmarked = favorites.some(fav => fav.id === property.id);
  const isInCompare = compareList.some(item => item.id === property.id);

  return (
    <div className="property-detail-container">
      {/* Floating Map Container */}
      <div className="floating-map-container">
        <div className="map-header">
          <h3>Property Location</h3>
          <button className="map-toggle-btn">Toggle Map</button>
        </div>
        <div className="map-content">
          <div className="map-placeholder">
            <p>Interactive Map Coming Soon</p>
            <p>📍 {property?.address}</p>
          </div>
        </div>
      </div>

      <div className="property-detail-header">
        <img src={property.imageUrl || property.image} alt={property.title} className="property-detail-image" />
        <div className="property-detail-info">
          <h1>{property.title}</h1>
          <p className="property-detail-address">{property.address}</p>
          <p className="property-detail-price">{formatCurrency(property.price)}</p>
          <div className="property-detail-actions">
            <button
              className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmarkToggle}
            >
              {isBookmarked ? <FaBookmark /> : <FaBookmark />}
              {isBookmarked ? ' Bookmarked' : ' Bookmark'}
            </button>
            <button
              className={`compare-btn ${isInCompare ? 'compared' : ''}`}
              onClick={handleCompareClick}
            >
              <FaListUl /> {isInCompare ? 'Compared' : 'Compare'}
            </button>
            <button className="calculate-btn" onClick={handleCalculateClick}>
              <FaCalculator /> Calculate Mortgage
            </button>
            <button className="virtual-buy-btn" onClick={handleVirtualTourClick}>
              <FaShoppingCart /> Virtual Buy
            </button>
          </div>
        </div>
      </div>

      <div className="property-detail-body">
        <h2>Overview</h2>
        <p>{property.description}</p>

        <div className="property-features">
          <div><strong>Type:</strong> {property.type}</div>
          <div><strong>Bedrooms:</strong> {property.bedrooms}</div>
          <div><strong>Bathrooms:</strong> {property.bathrooms}</div>
          <div><strong>Area:</strong> {property.area} sq ft</div>
          <div><strong>Listed On:</strong> {property.date}</div>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="property-amenities">
            <h3>Amenities</h3>
            <ul>
              {property.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Add more sections as needed, e.g., location map, contact form */}
      </div>
    </div>
  );
};

export default PropertyDetail;