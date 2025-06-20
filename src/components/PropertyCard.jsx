import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import '../styles/PropertyCard.css';

const formatCurrency = value =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const PropertyCard = ({
  image,
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
  onRemoveBookmark
}) => {
  return (
    <div className="property-card">
      {/* --- Remove button for dashboard view --- */}
      {isDashboardView && (
        <button
          onClick={onRemoveBookmark}
          className="remove-bookmark-btn"
          title="Remove Bookmark"
          type="button"
        >
          ×
        </button>
      )}
      <div className="card-image-section">
        <img loading="lazy" src={image} alt={title} />
        <span className="price-badge">{formatCurrency(price)}</span>
      </div>
      <div className="card-details-section">
        <h3>{title}</h3>
        <p className="address">{address}</p>
        {/* Only show bookmark button on listings, not dashboard */}
        {!isDashboardView && (
          <div className="date-bookmark-row">
            <span className="date">Listed on: {date}</span>
            <span className="bookmark-inline" style={{ position: 'relative' }}>
              <button
                className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}${bookmarkLoading ? ' loading' : ''}`}
                onClick={onBookmark}
                aria-label="Bookmark this property"
                disabled={bookmarkLoading}
                style={{ marginLeft: 10 }}
              >
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
              </button>
              <span style={{
                position: 'absolute',
                left: '35%',
                top: '-2px',
                transform: 'translateX(-50%)',
                minWidth: 0,
                fontSize: '0.85rem',
                padding: '2px 8px',
                borderRadius: '5px',
                whiteSpace: 'nowrap',
                zIndex: 2
              }}>
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
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;