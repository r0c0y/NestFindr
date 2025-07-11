import React from 'react';
import PropertyCard from '../PropertyCard';
import PropertyCardSkeleton from '../PropertyCardSkeleton';

const PropertyList = ({ properties, loading, bookmarkedIds, handleBookmarkToggle, handleCalculate, onPropertyClick }) => {
  if (loading) {
    return (
      <div className="properties-grid" aria-busy="true" aria-label="Loading properties">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="properties-grid">
      {properties.map((prop) => (
        <div 
          key={prop.id} 
          className="property-card-wrapper"
          onClick={() => onPropertyClick && onPropertyClick(prop.id)}
          style={{ cursor: onPropertyClick ? 'pointer' : 'default' }}
        >
          <PropertyCard
            {...prop}
            isBookmarked={bookmarkedIds.has(prop.id)}
            onBookmark={() => handleBookmarkToggle(prop.id)}
            onCalculate={() => handleCalculate(prop.id, prop.price, prop.title)}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
