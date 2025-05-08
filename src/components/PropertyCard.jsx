import React from 'react';
import '../styles/PropertyCard.css';

const PropertyCard = ({ image, title, address, price, date }) => (
  <div className="property-card">
    <img src={image} alt={title} />
    <div className="details">
      <h3>{title}</h3>
      <p>{address}</p>
      <p><strong>Price:</strong> {price}</p>
      <p><em>Listed on: {date}</em></p>
    </div>
  </div>
);

export default PropertyCard;
