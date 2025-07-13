import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookmark, FaTrash, FaCalculator, FaBell, FaListUl } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { addToCompare, removeFromCompare } from '../store/comparisonSlice';
import VirtualBuyingProcess from './VirtualBuyingProcess';
import '../styles/PropertyCard.css';

const formatCurrency = value =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const PropertyCard = ({
  id,
  image,
  imageUrl,
  title,
  address,
  price,
  date,
  isDashboardView,
  onCalculate,
  onAddReminder,
  showReminderButton = false,
}) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const compareList = useSelector((state) => state.comparison.compareList);

  const isBookmarked = favorites.some((fav) => fav.id === id);
  const isInCompare = compareList.some((item) => item.id === id);
  const navigate = useNavigate();
  const [isBuyingModalOpen, setBuyingModalOpen] = useState(false);

  const handlePropertyClick = (e) => {
    // Only navigate if not clicking on buttons or interactive elements
    if (!e.target.closest('button, a')) {
      navigate(`/listings/${id}`);
    }
  };

  // Use either image or imageUrl prop (for compatibility)
  const displayImage = image || imageUrl;

  const handleCompareClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      dispatch(removeFromCompare({ id }));
    } else {
      dispatch(addToCompare({ id, image, imageUrl, title, address, price, date }));
    }
  }, [isInCompare, dispatch, id, image, imageUrl, title, address, price, date]);

  const toggleBuyingProcess = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setBuyingModalOpen(!isBuyingModalOpen);
  }, [isBuyingModalOpen]);

  // Function to handle mortgage calculator button click
  const handleCalculateClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onCalculate) {
      // If a custom handler is provided, use it
      onCalculate(id, price, title);
    } else {
      // Default behavior: navigate to calculator with pre-filled values
      navigate(`/calculator?price=${price}&property=${encodeURIComponent(title)}`);
    }
  }, [id, price, title, onCalculate, navigate]);

  const handleBookmarkClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      dispatch(removeFavorite({ id }));
    } else {
      dispatch(addFavorite({ id, image, imageUrl, title, address, price, date }));
    }
  }, [isBookmarked, dispatch, id, image, imageUrl, title, address, price, date]);

  const handleRemoveBookmark = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFavorite({ id }));
  }, [dispatch, id]);

  const handleReminderClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddReminder) onAddReminder();
  }, [onAddReminder]);
  return (
    <div 
      className={`property-card ${isDashboardView ? 'dashboard-view' : ''}`}
      onClick={handlePropertyClick}
      style={{ cursor: isDashboardView ? 'default' : 'pointer' }}
    >
      {isDashboardView && (
        <button
            onClick={handleRemoveBookmark}
            className="remove-bookmark-btn"
            title="Remove"
            type="button"
          >
            <FaTrash />
          </button>
      )}
      <div className="card-image-section">
        <img loading="lazy" src={displayImage} alt={title} />
        <span className="price-badge">{formatCurrency(price)}</span>
      </div>
      <div className="card-details-section">
        <h3>{title}</h3>
        <p className="address">{address}</p>
        
        {!isDashboardView && (
          <div className="property-card-footer">
            {date && <span className="date">Listed on: {date}</span>}
            <div className="card-actions-horizontal">
              <button
                className="calculate-btn"
                onClick={handleCalculateClick}
                aria-label="Calculate mortgage"
              >
                <FaCalculator />
                <span className="calculate-btn-text">Calculate</span>
              </button>
              
              <button
                className="virtual-buy-btn"
                onClick={toggleBuyingProcess}
                aria-label="Start virtual buying process"
              >
                Virtual Buy
              </button>
              
              <button
                className={`compare-btn${isInCompare ? ' compared' : ''}`}
                onClick={handleCompareClick}
                aria-label="Compare this property"
              >
                <FaListUl />
                <span className="compare-btn-text">{isInCompare ? 'Remove' : 'Compare'}</span>
              </button>
              
              <button
                className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
                onClick={handleBookmarkClick}
                aria-label="Bookmark this property"
              >
                {isBookmarked ? <FaBookmark /> : <FaBookmark />}
              </button>
            </div>
          </div>
        )}

          {isDashboardView && (
            <div className="dashboard-actions">
              <div className="dashboard-buttons">
                <button
                  className="calculate-btn dashboard-calculate-btn"
                  onClick={handleCalculateClick}
                  aria-label="Calculate mortgage"
                >
                  <FaCalculator /><span className="calculate-btn-text">Calculate Mortgage</span>
                </button>

                {showReminderButton && (
                  <button
                    className="reminder-btn dashboard-reminder-btn"
                    onClick={handleReminderClick}
                    aria-label="Add mortgage reminder"
                  >
                    <FaBell /><span className="reminder-btn-text">Set Reminder</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {isBuyingModalOpen && 
          <VirtualBuyingProcess property={{ id, image: displayImage, title, location: address, price }} onClose={toggleBuyingProcess} />
        }
      </div>
  );
};

export default React.memo(PropertyCard);