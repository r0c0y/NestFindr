import React from 'react';
import '../styles/PropertyCard.css';

const PropertyCard = ({ image, title, address, price, date }) => (
  <div className="property-card">
    <div className="card-image-section">
      <img src={image} alt={title} />
      <span className="price-badge">{price}</span>
    </div>
    <div className="card-details-section">
      <h3>{title}</h3>
      <p className="address">{address}</p>
      <p className="date">Listed on: {date}</p>
    </div>
  </div>
);

export default PropertyCard;