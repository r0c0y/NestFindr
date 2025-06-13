import React from 'react';
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
  bookmarkLoading,
  bookmarkSaved,
  bookmarkRemoved,
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
  const handleCalculateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onCalculate) {
      // If a custom handler is provided, use it
      onCalculate(id, price, title);
    } else {
      // Default behavior: navigate to calculator with pre-filled values
      navigate(`/calculator?price=${price}&property=${encodeURIComponent(title)}`);
    }
  };
  return (
    <div className={`property-card ${isDashboardView ? 'dashboard-view' : ''}`}>
      {isDashboardView && (
        <button
          onClick={onRemoveBookmark}
          className={`remove-bookmark-btn ${bookmarkLoading ? 'loading' : ''}`}
          title="Remove"
          type="button"
          disabled={bookmarkLoading}
        >
          {bookmarkLoading ? <span className="loading-spinner"></span> : <BsTrash />}
        </button>
      )}
      <div className="card-image-section">
        {id ? (
          <Link to={`/listings/${id}`}>
            <img loading="lazy" src={displayImage} alt={title} />
          </Link>
        ) : (
          <img loading="lazy" src={displayImage} alt={title} />
        )}
        <span className="price-badge">{formatCurrency(price)}</span>
      </div>
      <div className="card-details-section">
        {id ? (
          <Link to={`/listings/${id}`} className="title-link">
            <h3>{title}</h3>
          </Link>
        ) : (
          <h3>{title}</h3>
        )}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onAddReminder) onAddReminder();
                    }}
                    aria-label="Add mortgage reminder"
                  >
                    <BsBell /> <span className="reminder-btn-text">Reminder</span>
                  </button>
                )}
              <span className="bookmark-inline">
                <button
                  className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}${bookmarkLoading ? ' loading' : ''}`}
                  onClick={onBookmark}
                  aria-label="Bookmark this property"
                  disabled={bookmarkLoading}
                >
                  {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
                </button>
                <div className="bookmark-status-container">
                  {bookmarkLoading && isBookmarked && (
                    <span className="bookmark-status bookmark-status-removing">Removing...</span>
                  )}
                  {bookmarkLoading && !isBookmarked && (
                    <span className="bookmark-status bookmark-status-loading">Saving...</span>
                  )}
                  {!bookmarkLoading && bookmarkSaved && (
                    <span className="bookmark-status bookmark-status-success">Saved!</span>
                  )}
                  {!bookmarkLoading && bookmarkRemoved && (
                    <span className="bookmark-status bookmark-status-removed">Removed!</span>
                  )}
                </div>
              </span>
            </div>
          </div>
        )}
        
        {isDashboardView && (
          <div className="dashboard-actions">
            {bookmarkRemoved && (
              <div className="bookmark-removed-indicator">
                <span className="bookmark-status bookmark-status-removed">Property removed from bookmarks</span>
              </div>
            )}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onAddReminder) onAddReminder();
                  }}
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

export default PropertyCard;