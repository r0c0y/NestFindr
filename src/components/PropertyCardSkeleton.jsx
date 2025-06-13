import React from 'react';
import '../styles/PropertyCardSkeleton.css';

/**
 * PropertyCardSkeleton component displays a loading placeholder
 * that matches the dimensions and layout of the PropertyCard component
 * @returns {JSX.Element} Skeleton loader component
 */
const PropertyCardSkeleton = () => {
  return (
    <div 
      className="property-card-skeleton" 
      aria-busy="true" 
      aria-label="Loading property information"
    >
      <div className="card-image-section-skeleton">
        <div className="image-skeleton pulse"></div>
        <div className="price-badge-skeleton pulse"></div>
      </div>
      
      <div className="card-details-section-skeleton">
        <div className="title-skeleton pulse"></div>
        <div className="address-skeleton pulse"></div>
        
        <div className="specs-skeleton">
          <div className="spec-item-skeleton pulse"></div>
          <div className="spec-item-skeleton pulse"></div>
          <div className="spec-item-skeleton pulse"></div>
        </div>
        
        <div className="bottom-row-skeleton">
          <div className="date-skeleton pulse"></div>
          <div className="actions-skeleton">
            <div className="action-button-skeleton pulse"></div>
            <div className="bookmark-skeleton pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;

