import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const Step1_Interest = ({ property, nextStep, formatPrice }) => (
  <div className="step-content">
    <h3>Step 1: Express Your Interest</h3>
    <div className="property-summary">
      <img src={property.image} alt={property.title} />
      <div className="property-info">
        <h4>{property.title}</h4>
        <p>{property.location}</p>
        <p className="price">{formatPrice(property.price)}</p>
      </div>
    </div>
    <p>Welcome to the Virtual Buying Process for this property! This guided experience helps you understand and simulate the key steps involved in purchasing a home, from expressing initial interest to securing financing and closing the deal. It's designed to give you a clear overview and help you prepare for a real-world transaction.</p>
    <div className="step-actions">
      <button type="button" onClick={nextStep} className="btn-primary">
        Show Interest <FiArrowRight />
      </button>
    </div>
  </div>
);

export default Step1_Interest;
