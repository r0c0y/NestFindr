import React from 'react';
import PropertyCard from '../PropertyCard';
import PropertyCardSkeleton from '../PropertyCardSkeleton';

const PropertyList = ({
  properties,
  loading,
  bookmarkedIds,
  handleBookmarkToggle,
  handleCalculate,
  onPropertyClick,
  addToCompare,
  removeFromCompare,
  isInCompare,
  compareList
}) => {
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
            isBookmarked={bookmarkedIds.some(fav => fav.id === prop.id)}
            onBookmark={() => handleBookmarkToggle(prop)}
            onCalculate={() => handleCalculate(prop.id, prop.price, prop.title)}
            onAddToCompare={() => addToCompare(prop)}
            onRemoveFromCompare={() => removeFromCompare(prop)}
            isInCompare={isInCompare(prop.id)}
            compareList={compareList}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyList;