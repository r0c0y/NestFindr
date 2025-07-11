import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import listingsData from '../data/listingsData'; // For local fallback
import '../styles/PropertyDetails.css';

// Map components - will be loaded dynamically
let MapContainer, TileLayer, Marker, Popup, L;

const PropertyDetails = () => {
  const { propertyId, id } = useParams();
  const actualId = propertyId || id; // Handle both route parameters
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
      <div className="property-details-header">
        <h1>{property.title}</h1>
        <p className="property-location">{property.location}</p>
      </div>
      <div className="property-image-gallery">
        {property.imageUrls && property.imageUrls.length > 0 ? (
          property.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Property image ${index + 1}`} className="property-main-image" />
          ))
        ) : (
          <div className="no-image-placeholder">No image available</div>
        )}
      </div>
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
      </div>
      <div className="property-description">
        <h2>Description</h2>
        <p>{property.description || 'No description available.'}</p>
      </div>
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
      <div className="property-map-section">
        <h2>Location Map</h2>
        {mapLoaded && MapContainer ? (
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '10px' }}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                {property.title} <br /> {property.address}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div style={{ height: '400px', width: '100%', borderRadius: '10px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              {mapLoaded ? 'Loading map...' : 'Map temporarily unavailable'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;