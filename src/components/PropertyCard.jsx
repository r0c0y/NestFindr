import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsBookmark, BsBookmarkFill, BsTrash, BsCalculator, BsBell } from 'react-icons/bs';
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
  isBookmarked,
  onBookmark,
  isDashboardView,
  onRemoveBookmark,
  onCalculate,
  onAddReminder,
  showReminderButton = false
}) => {
  const navigate = useNavigate();
  // Use either image or imageUrl prop (for compatibility)
  const displayImage = image || imageUrl;

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
    onBookmark();
  }, [onBookmark]);

  const handleRemoveBookmark = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveBookmark();
  }, [onRemoveBookmark]);

  const handleReminderClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddReminder) onAddReminder();
  }, [onAddReminder]);
  return (
    <div className={`property-card ${isDashboardView ? 'dashboard-view' : ''}`}>
      {isDashboardView && (
        <button
          onClick={handleRemoveBookmark}
          className="remove-bookmark-btn"
          title="Remove"
          type="button"
        >
          <BsTrash />
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
          <div className="date-bookmark-row">
            {date && <span className="date">Listed on: {date}</span>}
            <div className="card-actions">
                <button
                  className="calculate-btn"
                  onClick={handleCalculateClick}
                  aria-label="Calculate mortgage"
                >
                  <BsCalculator /> <span className="calculate-btn-text">Calculate</span>
                </button>
                
                {showReminderButton && (
                  <button
                    className="reminder-btn"
                    onClick={handleReminderClick}
                    aria-label="Add mortgage reminder"
                  >
                    <BsBell /> <span className="reminder-btn-text">Reminder</span>
                  </button>
                )}
              <span className="bookmark-inline">
                <button
                  className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
                  onClick={handleBookmarkClick}
                  aria-label="Bookmark this property"
                >
                  {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
                </button>
              </span>
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
                <BsCalculator /> <span className="calculate-btn-text">Calculate Mortgage</span>
              </button>
              
              {showReminderButton && (
                <button
                  className="reminder-btn dashboard-reminder-btn"
                  onClick={handleReminderClick}
                  aria-label="Add mortgage reminder"
                >
                  <BsBell /> <span className="reminder-btn-text">Set Reminder</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PropertyCard);
