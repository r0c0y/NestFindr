import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import listingsData from '../data/listingsData'; // For local fallback
import { BsArrowLeft, BsHeart, BsHeartFill, BsCalculator, BsGeoAlt, BsBuilding, BsCup, BsCart3, BsHospital } from 'react-icons/bs';
import { MdDirectionsBus } from 'react-icons/md';
import '../styles/PropertyDetails.css';

// Map components - will be loaded dynamically
let MapContainer, TileLayer, Marker, Popup, L, CircleMarker;

const PropertyDetails = ({ id: propId, onClose }) => {
  const { propertyId, id } = useParams();
  const navigate = useNavigate();
  const actualId = propId || propertyId || id; // Handle both route parameters and modal prop
  const isModal = Boolean(propId && onClose); // Check if used as modal
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [nearbyAmenities, setNearbyAmenities] = useState([]);
  const [showNearbyAmenities, setShowNearbyAmenities] = useState(false);
  const [mapView, setMapView] = useState('street'); // 'street' or 'satellite'
  const [selectedAmenityType, setSelectedAmenityType] = useState('all');

  useEffect(() => {
    // Load map components dynamically
    const loadMapComponents = async () => {
      try {
        const [leafletComponents, leafletLibrary] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);
        
        MapContainer = leafletComponents.MapContainer;
        TileLayer = leafletComponents.TileLayer;
        Marker = leafletComponents.Marker;
        Popup = leafletComponents.Popup;
        CircleMarker = leafletComponents.CircleMarker;
        L = leafletLibrary.default;
        
        // Fix for default marker icon issue with Webpack
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        setMapLoaded(true);
      } catch (error) {
        console.warn('Failed to load map components:', error);
        setMapLoaded(false);
      }
    };
    
    loadMapComponents();
  }, []);

  // Mock nearby amenities data (in real app, this would come from an API like Overpass or Google Places)
  const generateNearbyAmenities = useCallback((lat, lng) => {
    const amenities = [
      { id: 1, name: 'Starbucks Coffee', type: 'cafe', lat: lat + 0.002, lng: lng + 0.001, distance: '200m', icon: BsCup },
      { id: 2, name: 'Central Hospital', type: 'hospital', lat: lat - 0.003, lng: lng + 0.002, distance: '450m', icon: BsHospital },
      { id: 3, name: 'Metro Station', type: 'transport', lat: lat + 0.001, lng: lng - 0.002, distance: '150m', icon: MdDirectionsBus },
      { id: 4, name: 'Shopping Mall', type: 'shopping', lat: lat - 0.001, lng: lng + 0.003, distance: '300m', icon: BsCart3 },
      { id: 5, name: 'Office Complex', type: 'office', lat: lat + 0.004, lng: lng - 0.001, distance: '600m', icon: BsBuilding },
      { id: 6, name: 'Local Cafe', type: 'cafe', lat: lat - 0.002, lng: lng - 0.001, distance: '250m', icon: BsCup },
      { id: 7, name: 'Bus Stop', type: 'transport', lat: lat + 0.001, lng: lng + 0.001, distance: '100m', icon: MdDirectionsBus },
      { id: 8, name: 'Grocery Store', type: 'shopping', lat: lat + 0.002, lng: lng + 0.002, distance: '320m', icon: BsCart3 },
    ];
    return amenities;
  }, []);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
    // In real app, this would update Firebase/backend
  }, [isBookmarked]);

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

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'properties', actualId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedProperty = { id: docSnap.id, ...docSnap.data() };
          setProperty(fetchedProperty);
        } else {
          const localProperty = listingsData.find(p => p.id === actualId);
          if (localProperty) {
            setProperty(localProperty);
          } else {
            setError("Property not found.");
          }
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details.");
        const localProperty = listingsData.find(p => p.id === actualId);
        if (localProperty) {
          setProperty(localProperty);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [actualId]);

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
            <BsArrowLeft /> Back to Listings
          </button>
          <div className="property-actions">
            <button className="bookmark-button" onClick={handleBookmark}>
              {isBookmarked ? <BsHeartFill /> : <BsHeart />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button className="calculate-button" onClick={handleCalculate}>
              <BsCalculator /> Calculate Mortgage
            </button>
          </div>
        </div>
      )}

      {/* Property Header */}
      <div className="property-details-header">
        <h1>{property.title}</h1>
        <p className="property-location">
          <BsGeoAlt /> {property.address || property.location}
        </p>
        <div className="property-price-badge">
          ₹{property.price.toLocaleString()}
        </div>
      </div>

      {/* Property Images */}
      <div className="property-image-gallery">
        {property.imageUrls && property.imageUrls.length > 0 ? (
          property.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Property image ${index + 1}`} className="property-main-image" />
          ))
        ) : (
          <div className="property-image-placeholder">
            <img src={property.imageUrl || 'https://via.placeholder.com/600x400?text=Property+Image'} alt={property.title} className="property-main-image" />
          </div>
        )}
      </div>

      {/* Property Info Grid */}
      <div className="property-info-grid">
        <div className="property-info-item">
          <strong>Price:</strong> ₹{property.price.toLocaleString()}
        </div>
        <div className="property-info-item">
          <strong>Bedrooms:</strong> {property.bedrooms || 'N/A'}
        </div>
        <div className="property-info-item">
          <strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}
        </div>
        <div className="property-info-item">
          <strong>Area:</strong> {property.area ? `${property.area} sqft` : 'N/A'}
        </div>
        <div className="property-info-item">
          <strong>Type:</strong> {property.type || 'N/A'}
        </div>
        <div className="property-info-item">
          <strong>Listed:</strong> {property.date || 'N/A'}
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
        {mapLoaded && MapContainer ? (
          <div className="map-container">
            <MapContainer 
              center={position} 
              zoom={15} 
              scrollWheelZoom={true} 
              style={{ height: '500px', width: '100%', borderRadius: '10px' }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Property Marker */}
              <Marker position={position}>
                <Popup>
                  <div className="custom-popup">
                    <h3>{property.title}</h3>
                    <p>{property.address}</p>
                    <p><strong>₹{property.price.toLocaleString()}</strong></p>
                    <p>{property.bedrooms} bed • {property.bathrooms} bath</p>
                  </div>
                </Popup>
              </Marker>

              {/* Nearby Amenities Markers */}
              {showNearbyAmenities && filteredAmenities.map((amenity) => (
                <CircleMarker
                  key={amenity.id}
                  center={[amenity.lat, amenity.lng]}
                  radius={8}
                  fillColor={getAmenityColor(amenity.type)}
                  color={getAmenityColor(amenity.type)}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <div className="amenity-popup">
                      <h4>{amenity.name}</h4>
                      <p>Distance: {amenity.distance}</p>
                      <p>Type: {amenity.type}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="map-placeholder">
            <p>{mapLoaded ? 'Loading map...' : 'Map temporarily unavailable'}</p>
          </div>
        )}
      </div>

      {/* Nearby Amenities List */}
      {showNearbyAmenities && (
        <div className="nearby-amenities-section">
          <h2>Nearby Amenities</h2>
          <div className="amenities-grid">
            {filteredAmenities.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <div key={amenity.id} className="amenity-card">
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
    </div>
  );
};

export default PropertyDetails;