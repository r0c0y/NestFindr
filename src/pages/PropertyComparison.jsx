import React, { useState, useCallback } from 'react';
import { FaHome, FaExpandArrowsAlt, FaMapMarkerAlt, FaDollarSign, FaCheck, FaBath, FaBed, FaCalendarAlt, FaInfoCircle, FaListAlt, FaCog, FaPhone, FaCalculator } from 'react-icons/fa';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCompare, clearCompare } from '../store/comparisonSlice';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ContactAgentModal from '../components/ContactAgentModal';
import Modal from '../components/Modal/Modal';
import SimplifiedMortgageCalculatorModal from '../components/SimplifiedMortgageCalculatorModal/SimplifiedMortgageCalculatorModal';
import '../styles/PropertyComparison.css';
import Footer from '../components/Footer';

const mockAgentData = {
  1: { name: 'Alice Smith', phone: '+91 98765 43210', color: '#FF5733' }, // Modern Apartment
  2: { name: 'Bob Johnson', phone: '+91 99887 76655', color: '#33FF57' }, // Spacious House
  4: { name: 'Charlie Brown', phone: '+91 91234 56789', color: '#3357FF' }, // Luxury Villa
  5: { name: 'Diana Prince', phone: '+91 90000 11111', color: '#FF33A1' }, // Charming Cottage
  6: { name: 'Eve Adams', phone: '+91 95555 22222', color: '#A133FF' }, // Urban Flat
};

const PropertyComparison = () => {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.comparison.compareList);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPropertyForAgent, setSelectedPropertyForAgent] = useState(null);
  const [showMortgageModal, setShowMortgageModal] = useState(false);
  const [selectedPropertyForMortgage, setSelectedPropertyForMortgage] = useState(null);
  const [mortgageResults, setMortgageResults] = useState({}); // Stores mortgage results for each property
  const [tfootKey, setTfootKey] = useState(0); // Key to force re-render of tfoot

  const handleClearCompare = () => {
    dispatch(clearCompare());
    setMortgageResults({}); // Clear mortgage results when comparison list is cleared
    setTfootKey(prev => prev + 1); // Increment key to force re-render
  };
  const handleRemoveFromCompare = (propertyId) => {
    dispatch(removeFromCompare({ id: propertyId }));
    setMortgageResults(prev => {
      const newResults = { ...prev };
      delete newResults[propertyId];
      return newResults;
    });
    setTfootKey(prev => prev + 1); // Increment key to force re-render
  };

  const handleOpenContactAgent = (property) => {
    console.log("handleOpenContactAgent called with property:", property);
    if (!currentUser) {
      showNotification('Please login to contact an agent', 'error');
      return;
    }
    setSelectedPropertyForAgent({
      ...property,
      agentName: mockAgentData[property.id]?.name || 'Agent Name',
      agentPhone: mockAgentData[property.id]?.phone || '+91 XXXXXXXXXX',
      agentColor: mockAgentData[property.id]?.color || '#007bff',
    });
    console.log("selectedPropertyForAgent after set:", { ...property,
      agentName: mockAgentData[property.id]?.name || 'Agent Name',
      agentPhone: mockAgentData[property.id]?.phone || '+91 XXXXXXXXXX',
      agentColor: mockAgentData[property.id]?.color || '#007bff',
    });
    setShowContactModal(true);
  };

  const handleOpenMortgageCalculator = () => {
    setSelectedPropertyForMortgage(null); // Indicate that we want to calculate for all properties
    setShowMortgageModal(true);
  };

  const handleMortgageCalculated = (propertyId, monthlyPayment) => {
    setMortgageResults(prev => ({
      ...prev,
      [propertyId]: monthlyPayment
    }));
    setTfootKey(prev => prev + 1); // Increment key to force re-render
    showNotification(`Mortgage calculated for ${compareList.find(p => p.id === propertyId)?.title}`, 'success');
  };

  if (compareList.length === 0) {
    return (
      <div className="comparison-empty">
        <div className="empty-state">
          <FaHome className="empty-icon" />
          <h2>No Properties to Compare</h2>
          <p>Add properties to your comparison list to see them here.</p>
          <button className="btn-primary" onClick={() => navigate('/listings')}>
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const comparisonFeatures = [
    { key: 'price', label: 'Price', icon: FaDollarSign, type: 'number', compare: 'min' },
    { key: 'type', label: 'Property Type', icon: FaHome, type: 'string' },
    { key: 'bedrooms', label: 'Bedrooms', icon: FaBed, type: 'number', compare: 'max' },
    { key: 'bathrooms', label: 'Bathrooms', icon: FaBath, type: 'number', compare: 'max' },
    { key: 'area', label: 'Area (sq ft)', icon: FaExpandArrowsAlt, type: 'number', compare: 'max' },
    { key: 'location', label: 'Location', icon: FaMapMarkerAlt, type: 'string' },
    { key: 'date', label: 'Listed On', icon: FaCalendarAlt, type: 'string' },
    { key: 'description', label: 'Description', icon: FaInfoCircle, type: 'string' },
    { key: 'amenities', label: 'Amenities', icon: FaListAlt, type: 'array' },
  ];

  const formatPrice = (price) => {
    console.log("formatPrice received:", price, "type:", typeof price);
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  };

  const getFeatureValue = (property, key, type) => {
    if (type === 'array') return property[key] ? property[key].join(', ') : 'N/A';
    if (type === 'string') return property[key] || 'N/A';
    if (type === 'number') return property[key] != null ? property[key] : 0;
    return 'N/A';
  };

  const getBestValue = (featureKey, properties, compareType) => {
    const values = properties.map(p => p[featureKey]).filter(v => v != null);
    if (values.length === 0) return null;
    if (compareType === 'min') return Math.min(...values);
    if (compareType === 'max') return Math.max(...values);
    return null;
  };

  const isHighlight = (property, featureKey, compareType) => {
    const bestValue = getBestValue(featureKey, compareList, compareType);
    if (bestValue === null) return false;
    return property[featureKey] === bestValue;
  };

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft /> Back</button>
        <div className="header-content"><h1>Property Comparison</h1><p>Compare up to 4 properties side by side</p></div>
        <button className="clear-btn" onClick={handleClearCompare}>Clear All</button>
      </div>

      <div className="comparison-table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="table-header-feature-col">Property</th>
              {compareList.map((property) => (
                <motion.th key={property.id} className="table-header-property-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button className="remove-btn" onClick={() => handleRemoveFromCompare(property.id)}><FiX /></button>
                  <div className="property-header-content">
                    <div className="property-image-wrapper"><img src={property.image || 'https://via.placeholder.com/300x200'} alt={property.title} /></div>
                    <div className="property-info"><h3>{property.title}</h3><p className="property-price">{formatPrice(property.price)}</p></div>
                  </div>
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature) => (
              <tr key={feature.key} className="table-row">
                <td className="table-cell feature-label-cell"><feature.icon className="feature-icon" /><span>{feature.label}</span></td>
                {compareList.map((property) => (
                  <td key={property.id} className={`table-cell property-value-cell ${feature.compare && isHighlight(property, feature.key, feature.compare) ? 'highlight' : ''}`}>
                    {feature.compare && isHighlight(property, feature.key, feature.compare) && <FaCheck className="best-value-icon" />}
                    <span>{feature.key === 'price' ? formatPrice(getFeatureValue(property, feature.key, feature.type)) : feature.key === 'area' ? `${getFeatureValue(property, feature.key, feature.type)} sq ft` : getFeatureValue(property, feature.key, feature.type)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot key={tfootKey}>
            <tr className="action-row">
              <td className="table-cell feature-label-cell">
                <FaCog className="feature-icon" />
                <span>Actions</span>
              </td>
              {compareList.map((property) => (
                <td key={property.id} className="table-cell property-action-cell">
                  <div className="action-buttons-wrapper">
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`/listings/${property.id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleOpenContactAgent(property)}
                    >
                      <FaPhone /> Agent
                    </button>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="mortgage-row">
              <td className="table-cell feature-label-cell mortgage-calculator-trigger" onClick={handleOpenMortgageCalculator}>
                <FaCalculator className="feature-icon" />
                <span>Mortgage (Monthly)</span>
              </td>
              {compareList.map((property) => (
                <td key={`${property.id}-${mortgageResults[property.id]}`} className="table-cell property-value-cell mortgage-value-cell">
                  {console.log(`Rendering mortgage for ${property.id}: ${mortgageResults[property.id]}`)}
                  {mortgageResults[property.id] ? (
                    <span className="mortgage-result-text">
                      {formatPrice(Number(mortgageResults[property.id]))}
                    </span>
                  ) : (
                    <span className="no-mortgage-text">N/A</span>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <Footer />

      {showContactModal && selectedPropertyForAgent && (
        <ContactAgentModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          propertyTitle={selectedPropertyForAgent?.title || 'Selected Property'}
          agentName={selectedPropertyForAgent?.agentName}
          agentPhone={selectedPropertyForAgent?.agentPhone}
          agentColor={selectedPropertyForAgent?.agentColor}
        />
      )}

      {showMortgageModal && (
        <SimplifiedMortgageCalculatorModal
          isOpen={showMortgageModal}
          onClose={() => setShowMortgageModal(false)}
          propertyPrice={selectedPropertyForMortgage?.price} // Will be undefined when calculating for all
          propertyTitle={selectedPropertyForMortgage?.title} // Will be undefined when calculating for all
          compareList={compareList} // Pass the entire compareList
          setMortgageResults={setMortgageResults} // Pass the setter for mortgage results
          isComparisonMode={true} // Indicate that it's in comparison mode
          onCalculate={() => {
            // This callback is for single property calculation, not used in comparison mode
            // The setMortgageResults prop handles updates for all properties
          }}
        />
      )}
    </div>
  );
};

export default PropertyComparison;