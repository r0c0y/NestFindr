import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';

import { FaArrowLeft, FaHeart, FaHeartbeat, FaCalculator, FaMapMarkerAlt, FaBuilding, FaCoffee, FaShoppingCart, FaHospital, FaPhone, FaCommentDots, FaRupeeSign, FaHome, FaBed, FaBath, FaExpandArrowsAlt, FaCalendarAlt, FaBook, FaWalking, FaChartLine, FaShareAlt } from 'react-icons/fa';
import { MdDirectionsBus } from 'react-icons/md';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon } from 'react-share';
import VirtualBuyingProcess from '../components/VirtualBuyingProcess';
import Map from '../components/Map'; // Import our new Map component
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../styles/PropertyDetails.css';
import ContactAgentModal from '../components/ContactAgentModal'; // Add this import

const PropertyDetails = ({ id: propId, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProperties = useSelector((state) => state.properties.listings);
  const favorites = useSelector((state) => state.favorites.favorites);

  const actualId = propId || id; // Handle both route parameters and modal prop
  const isModal = Boolean(propId && onClose); // Check if used as modal
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearbyAmenities, setNearbyAmenities] = useState([]);
  const [showNearbyAmenities, setShowNearbyAmenities] = useState(false);
  const [mapView, setMapView] = useState('street'); // 'street' or 'satellite'
  const [showVirtualBuy, setShowVirtualBuy] = useState(false);
  const [activeAmenity, setActiveAmenity] = useState(null); // New state for active amenity
  const [pathToAmenity, setPathToAmenity] = useState(null); // New state for path
  const [showContactModal, setShowContactModal] = useState(false); // Add this state
  const [selectedAmenityType, setSelectedAmenityType] = useState('all'); // Add this state
  const [showShareOptions, setShowShareOptions] = useState(false); // New state for sharing options

  const isBookmarked = favorites.some((fav) => fav.id === actualId);

  // Mock nearby amenities data (in real app, this would come from an API like Overpass or Google Places)
  const generateNearbyAmenities = useCallback((lat, lng) => {
    const amenities = [
      { id: 1, name: 'Starbucks Coffee', type: 'cafe', lat: lat + 0.002, lng: lng + 0.001, distance: '200m', icon: FaCoffee },
      { id: 2, name: 'Central Hospital', type: 'hospital', lat: lat - 0.003, lng: lng + 0.002, distance: '450m', icon: FaHospital },
      { id: 3, name: 'Metro Station', type: 'transport', lat: lat + 0.001, lng: lng - 0.002, distance: '150m', icon: MdDirectionsBus },
      { id: 4, name: 'Shopping Mall', type: 'shopping', lat: lat - 0.001, lng: lng + 0.003, distance: '300m', icon: FaShoppingCart },
      { id: 5, name: 'Office Complex', type: 'office', lat: lat + 0.004, lng: lng - 0.001, distance: '600m', icon: FaBuilding },
      { id: 6, name: 'Local Cafe', type: 'cafe', lat: lat - 0.002, lng: lng - 0.001, distance: '250m', icon: FaCoffee },
      { id: 7, name: 'Bus Stop', type: 'transport', lat: lat + 0.001, lng: lng + 0.001, distance: '100m', icon: MdDirectionsBus },
      { id: 8, name: 'Grocery Store', type: 'shopping', lat: lat + 0.002, lng: lng + 0.002, distance: '320m', icon: FaShoppingCart },
    ];
    return amenities;
  }, []);

  const handleBookmark = useCallback(() => {
    if (!property) return;
    if (isBookmarked) {
      dispatch(removeFavorite(property));
    } else {
      dispatch(addFavorite(property));
    }
  }, [isBookmarked, property, dispatch]);

  const handleCalculate = useCallback(() => {
    if (property) {
      if (isModal && onClose) {
        onClose(); // Close modal first
        setTimeout(() => {
          navigate(`/calculator?price=${property.price}&property=${encodeURIComponent(property.title)}`);
        }, 100);
      } else {
        navigate(`/calculator?price=${property.price}&property=${encodeURIComponent(property.title)}`);
      }
    }
  }, [property, navigate, isModal, onClose]);

  const handleBackClick = useCallback(() => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  }, [isModal, onClose, navigate]);

  const getAmenityColor = (type) => {
    const colors = {
      cafe: '#8B4513',
      hospital: '#DC143C',
      transport: '#1E90FF',
      shopping: '#32CD32',
      office: '#696969',
      default: '#FF7300'
    };
    return colors[type] || colors.default;
  };

  const filteredAmenities = selectedAmenityType === 'all'
    ? nearbyAmenities
    : nearbyAmenities.filter(amenity => amenity.type === selectedAmenityType);

  useEffect(() => {
    if (property && property.lat && property.lng) {
      setNearbyAmenities(generateNearbyAmenities(property.lat, property.lng));
    }
  }, [property, generateNearbyAmenities]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const foundProperty = allProperties.find(p => p.id === actualId);
    if (foundProperty) {
      setProperty(foundProperty);
      setLoading(false);
    } else {
      setError("Property not found in Redux store.");
      setLoading(false);
    }
  }, [actualId, allProperties]);

  if (loading) {
    return <div className="property-details-container">Loading property details...</div>;
  }

  if (error) {
    return <div className="property-details-container property-details-error">Error: {error}</div>;
  }

  if (!property) {
    return <div className="property-details-container">Property not found.</div>;
  }

  const position = [property.lat || 34.052235, property.lng || -118.243683];

  return (
    <div className="property-details-container">
      {/* Navigation Header */}
      {!isModal && (
        <div className="property-nav-header">
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back to Listings
          </button>
          <div className="property-actions">
          
            <button className="calculate-button" onClick={handleCalculate}>
              <FaCalculator /> Mortrage
            </button>
            <button className="buy-button" onClick={() => setShowVirtualBuy(true)}>
              <FaShoppingCart /> Virtual Buy
            </button>
            

            <div className="share-buttons-compact">
              <FacebookShareButton url={window.location.href} quote={property.title}>
                <FacebookIcon size={24} round />
              </FacebookShareButton>
              <TwitterShareButton url={window.location.href} title={property.title}>
                <TwitterIcon size={24} round />
              </TwitterShareButton>
              <WhatsappShareButton url={window.location.href} title={property.title}>
                <WhatsappIcon size={24} round />
              </WhatsappShareButton>
              <EmailShareButton url={window.location.href} subject={`Check out this property: ${property.title}`} body={property.description}>
                <EmailIcon size={24} round />
              </EmailShareButton>
            </div>
          </div>
        </div>
      )}

      {/* Property Header */}
      <div className="property-details-header">
        <h1>{property.title}</h1>
        <p className="property-location">
          <FaMapMarkerAlt /> {property.address || property.location}
        </p>
        <div className="property-price-badge">
          ₹{property.price.toLocaleString()}
        </div>
        <button className="icon-button share-icon" onClick={() => setShowShareOptions(!showShareOptions)} title="Share Property">
          <FaShareAlt />
        </button>
        {showShareOptions && (
          <div className="share-options-dropdown">
            <FacebookShareButton url={window.location.href} quote={property.title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href} title={property.title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={window.location.href} title={property.title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <EmailShareButton url={window.location.href} subject={`Check out this property: ${property.title}`} body={property.description}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        )}
      </div>

      {/* Property Images */}
      <div className="property-image-gallery">
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <ImageGallery
            items={property.imageUrls.map(url => ({ original: url, thumbnail: url }))}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={true}
            showBullets={true}
            autoPlay={true}
            thumbnailPosition="bottom"
          />
        ) : (
          <div className="property-image-placeholder">
            <img src={property.imageUrl || 'https://via.placeholder.com/600x400?text=Property+Image'} alt={property.title} className="property-main-image" />
          </div>
        )}
      </div>

      {/* Property Info Grid */}
      <div className="property-info-grid">
        <div className="property-info-item">
          <strong><FaRupeeSign /> Price:</strong> ₹{property.price.toLocaleString()}
        </div>
        <div className="property-info-item">
          <strong><FaHome /> Type:</strong> {property.type || 'N/A'}
        </div>
        <div className="property-info-item">
          <strong><FaBed /> Bedrooms:</strong> {property.bedrooms || 'N/A'}
        </div>
        <div className="property-info-item">
          <strong><FaBath /> Bathrooms:</strong> {property.bathrooms || 'N/A'}
        </div>
        <div className="property-info-item">
          <strong><FaExpandArrowsAlt /> Area:</strong> {property.area ? `${property.area} sqft` : 'N/A'}
        </div>
        <div className="property-info-item">
          <strong><FaCalendarAlt /> Listed:</strong> {property.date || 'N/A'}
        </div>
      </div>

      {/* Property Description */}
      <div className="property-description">
        <h2>Description</h2>
        <p>{property.description || 'No description available.'}</p>
      </div>

      {/* Property Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="property-amenities">
          <h2>Amenities</h2>
          <ul>
            {property.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Map Section */}
      <div className="property-map-section">
        <div className="map-header">
          <h2>Location & Nearby</h2>
          <div className="map-controls">
            <button
              className={`map-control-btn ${mapView === 'street' ? 'active' : ''}`}
              onClick={() => setMapView('street')}
            >
              Street View
            </button>
            <button
              className={`map-control-btn ${mapView === 'satellite' ? 'active' : ''}`}
              onClick={() => setMapView('satellite')}
            >
              Satellite View
            </button>
            <button
              className={`map-control-btn ${showNearbyAmenities ? 'active' : ''}`}
              onClick={() => setShowNearbyAmenities(!showNearbyAmenities)}
            >
              {showNearbyAmenities ? 'Hide' : 'Show'} Nearby
            </button>
          </div>
        </div>

        {/* Amenity Filter */}
        {showNearbyAmenities && (
          <div className="amenity-filters">
            <select
              value={selectedAmenityType}
              onChange={(e) => setSelectedAmenityType(e.target.value)}
              className="amenity-filter-select"
            >
              <option value="all">All Amenities</option>
              <option value="cafe">Cafés & Restaurants</option>
              <option value="hospital">Healthcare</option>
              <option value="transport">Transportation</option>
              <option value="shopping">Shopping</option>
              <option value="office">Offices</option>
            </select>
          </div>
        )}

        {/* Interactive Map */}
        <div className="map-container">
          <Map
            position={position}
            popupText={property.title}
            mapView={mapView}
            activeAmenity={activeAmenity}
            amenities={filteredAmenities} // Pass filtered amenities to Map component
            getAmenityColor={getAmenityColor} // Pass amenity color function
            pathToAmenity={pathToAmenity} // Pass path to amenity
          />
        </div>
      </div>

      {/* Nearby Amenities List */}
      {showNearbyAmenities && (
        <div className="nearby-amenities-section">
          <h2>Nearby Amenities</h2>
          <div className="amenities-grid">
            {filteredAmenities.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <div
                  key={amenity.id}
                  className="amenity-card"
                  onClick={() => {
                    setActiveAmenity(amenity);
                    setPathToAmenity([position, [amenity.lat, amenity.lng]]);
                  }} // Set active amenity and path on click
                >
                  <div className="amenity-icon" style={{ color: getAmenityColor(amenity.type) }}>
                    <IconComponent />
                  </div>
                  <div className="amenity-info">
                    <h4>{amenity.name}</h4>
                    <p>{amenity.distance} away</p>
                    <span className="amenity-type">{amenity.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}



      {/* Neighborhood Insights */}
      <div className="neighborhood-insights">
        <h2>Neighborhood Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <h3><FaBook className="insight-icon" /> School Ratings</h3>
            <p>Overall: <span className="rating-score">8/10</span></p>
            <p className="text-sm text-gray-600">Top-rated schools nearby include:</p>
            <ul>
              <li>Elementary: Oakwood Primary (9/10)</li>
              <li>Middle: Central Middle (7/10)</li>
              <li>High: City High (8/10)</li>
            </ul>
          </div>
          <div className="insight-item">
            <h3><FaWalking className="insight-icon" /> Walk Score & Transit</h3>
            <p>Walk Score: <span className="rating-score">75</span> (Very Walkable)</p>
            <p>Transit Score: <span className="rating-score">60</span> (Good Transit)</p>
            <p className="text-sm text-gray-600">Easy access to public transportation and daily errands can be accomplished on foot.</p>
          </div>
          <div className="insight-item">
            <h3><FaChartLine className="insight-icon" /> Local Market Trends</h3>
            <p>Median Home Price: <span className="price-trend">₹5.5 Cr</span></p>
            <p>Price Change (1yr): <span className="price-trend-positive">+5.2%</span></p>
            <p className="text-sm text-gray-600">The neighborhood shows steady appreciation with strong buyer demand.</p>
          </div>
        </div>
      </div>

            {/* Agent Profile/Contact Card */}
      <div className="agent-contact-card">
        <div className="agent-info">
          <img src="https://via.placeholder.com/100" alt="Agent" className="agent-avatar" />
          <div className="agent-details">
            <h3>Jane Doe <button className="icon-button call-agent-icon-inline" onClick={() => setShowContactModal(true)} title="Call for Inquiry"><FaPhone /></button></h3>
            <p>Listing Agent</p>
          </div>
        </div>
      </div>

      {showVirtualBuy && (
        <VirtualBuyingProcess
          property={property}
          onClose={() => setShowVirtualBuy(false)}
        />
      )}

      {showContactModal && (
        <ContactAgentModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          propertyTitle={property.title}
        />
      )}
    </div>
  );
}

export default PropertyDetails;