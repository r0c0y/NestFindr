import React, { useState } from 'react';
import { FaHome, FaExpandArrowsAlt, FaMapMarkerAlt, FaDollarSign, FaCheck, FaBath, FaBed, FaCalendarAlt, FaInfoCircle, FaListAlt, FaChartBar, FaDownload, FaFilter, FaSort, FaStar, FaTrophy, FaBalanceScale } from 'react-icons/fa';
import { FiArrowLeft, FiX, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCompare, clearCompare } from '../store/comparisonSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/PropertyComparison.css';

const PropertyComparison = () => {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.comparison.compareList);
  const favorites = useSelector((state) => state.favorites.favorites);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  // Enhanced state management
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed', 'chart', 'scored'
  const [sortBy, setSortBy] = useState('score'); // 'score', 'price', 'area'
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterFeatures, setFilterFeatures] = useState([]);
  const [propertyScores, setPropertyScores] = useState({});

  const handleClearCompare = () => {
    dispatch(clearCompare());
  };

  const handleRemoveFromCompare = (propertyId) => {
    dispatch(removeFromCompare({ id: propertyId }));
  };

  const handleToggleFavorite = (property) => {
    if (!user) {
      addNotification('Please login to add properties to favorites', 'error');
      return;
    }
    
    const isCurrentlyFavorited = favorites.some(fav => fav.id === property.id);
    if (isCurrentlyFavorited) {
      dispatch(removeFavorite(property));
      addNotification('Property removed from favorites', 'success');
    } else {
      dispatch(addFavorite(property));
      addNotification('Property added to favorites', 'success');
    }
  };

  const isInFavorites = (propertyId) => {
    return favorites.some(fav => fav.id === propertyId);
  };

  if (compareList.length === 0) {
    return (
      <div className="comparison-empty">
        <div className="empty-state">
          <FaHome className="empty-icon" />
          <h2>No Properties to Compare</h2>
          <p>Add properties to your comparison list to see them here.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/listings')}
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const comparisonFeatures = [
    { key: 'price', label: 'Price', icon: FaDollarSign, type: 'number', compare: 'min' },
    { key: 'type', label: 'Property Type', icon: FaHome, type: 'string' },
    { key: 'bedrooms', label: 'Bedrooms', icon: FaBed, type: 'number', compare: 'max' },
    { key: 'bathrooms', label: 'Bathrooms', icon: FaBath, type: 'number', compare: 'max' },
    { key: 'area', label: 'Area (sq ft)', icon: FaExpandArrowsAlt, type: 'number', compare: 'max' },
    { key: 'location', label: 'Location', icon: FaMapMarkerAlt, type: 'string' },
    { key: 'date', label: 'Listed On', icon: FaCalendarAlt, type: 'string' },
    { key: 'description', label: 'Description', icon: FaInfoCircle, type: 'string' },
    { key: 'amenities', label: 'Amenities', icon: FaListAlt, type: 'array' },
  ];

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getFeatureValue = (property, key, type) => {
    if (type === 'array') {
      return property[key] ? property[key].join(', ') : 'N/A';
    } else if (type === 'string') {
      return property[key] || 'N/A';
    } else if (type === 'number') {
      return property[key] !== undefined && property[key] !== null ? property[key] : 0;
    }
    return 'N/A';
  };

  const getBestValue = (featureKey, properties, compareType) => {
    if (properties.length === 0) return null;

    const values = properties.map(p => p[featureKey]).filter(v => v !== undefined && v !== null);
    if (values.length === 0) return null;

    if (compareType === 'min') {
      return Math.min(...values);
    } else if (compareType === 'max') {
      return Math.max(...values);
    }
    return null;
  };

  const isHighlight = (property, featureKey, compareType) => {
    const bestValue = getBestValue(featureKey, compareList, compareType);
    if (bestValue === null) return false;

    if (compareType === 'min') {
      return property[featureKey] === bestValue;
    } else if (compareType === 'max') {
      return property[featureKey] === bestValue;
    }
    return false;
  };

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Back
        </button>
        <div className="header-content">
          <h1>Property Comparison</h1>
          <p>Compare up to 4 properties side by side</p>
        </div>
        <button 
          className="clear-btn"
          onClick={handleClearCompare}
        >
          Clear All
        </button>
      </div>

      <div className="comparison-grid-container">
        <div className="feature-labels-column">
          {comparisonFeatures.map((feature) => (
            <div key={feature.key} className="feature-label-item">
              <feature.icon className="feature-icon" />
              <span>{feature.label}</span>
            </div>
          ))}
          <div className="feature-label-item">{/* For action buttons */}</div>
        </div>

        <div className="properties-scroll-container">
          <div className="property-headers-row">
            {compareList.map((property) => (
              <motion.div
                key={property.id}
                className="property-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCompare(property.id)}
                >
                  <FiX />
                </button>
                <div className="property-image">
                  <img src={property.image || 'https://via.placeholder.com/300x200'} alt={property.title} />
                </div>
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="property-location">{property.location}</p>
                  <p className="property-price">{formatPrice(property.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="feature-rows-container">
            {comparisonFeatures.map((feature) => (
              <div key={feature.key} className="feature-row">
                {compareList.map((property) => (
                  <div
                    key={property.id}
                    className={`feature-value ${
                      feature.compare && isHighlight(property, feature.key, feature.compare) ? 'highlight' : ''
                    }`}
                  >
                    {feature.compare && isHighlight(property, feature.key, feature.compare) && (
                      <FaCheck className="best-value-icon" />
                    )}
                    <span>
                      {feature.key === 'price'
                        ? formatPrice(getFeatureValue(property, feature.key, feature.type))
                                              : feature.key === 'area'
                        ? `${getFeatureValue(property, feature.key, feature.type)} sq ft`
                        : getFeatureValue(property, feature.key, feature.type)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="comparison-actions-row">
            {compareList.map((property) => (
              <div key={property.id} className="property-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/listings/${property.id}`)}
                >
                  View Details
                </button>
                <button
                  className={`btn-secondary ${isInFavorites(property.id) ? 'favorited' : ''}`}
                  onClick={() => handleToggleFavorite(property)}
                >
                  {isInFavorites(property.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default PropertyComparison;