import React from 'react';
import '../styles/PropertyCard.css';

const formatCurrency = value =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const PropertyCard = ({ image, title, address, price, date }) => (
  <div className="property-card">
    <div className="card-image-section">
      <img loading="lazy" src={image} alt={title} />
      <span className="price-badge">{formatCurrency(price)}</span>
    </div>
    <div className="card-details-section">
      <h3>{title}</h3>
      <p className="address">{address}</p>
      <p className="date">Listed on: {date}</p>
    </div>
  </div>
);

export default PropertyCard;