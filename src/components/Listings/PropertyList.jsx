import React from 'react';
import PropertyCard from '../PropertyCard';
import PropertyCardSkeleton from '../PropertyCardSkeleton';

const PropertyList = ({ properties, loading, bookmarkedIds, handleBookmarkToggle, handleCalculate }) => {
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
        <PropertyCard
          key={prop.id}
          {...prop}
          isBookmarked={bookmarkedIds.has(prop.id)}
          onBookmark={() => handleBookmarkToggle(prop.id)}
          onCalculate={() => handleCalculate(prop.id, prop.price, prop.title)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
