import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetail = () => {
  const { id } = useParams();

  return (
    <div className="property-detail-container">
      <h2>Property Detail Page</h2>
      <p>Displaying details for property ID: {id}</p>
      {/* In a real application, you would fetch property details using the ID */}
    </div>
  );
};

export default PropertyDetail;
