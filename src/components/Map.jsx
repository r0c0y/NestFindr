import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({ position, popupText, mapView, activeAmenity, amenities, getAmenityColor, pathToAmenity }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [map]);

  useEffect(() => {
    if (map && activeAmenity) {
      map.flyTo([activeAmenity.lat, activeAmenity.lng], 16); // Fly to amenity location
    }
  }, [map, activeAmenity]);

  if (!position || position.length !== 2) {
    return <div>Map location not available.</div>;
  }

  const currentPosition = activeAmenity ? [activeAmenity.lat, activeAmenity.lng] : position;

  return (
    <MapContainer 
      center={currentPosition} 
      zoom={15} 
      scrollWheelZoom={false} 
      style={{ height: '400px', width: '100%', borderRadius: '12px' }}
      ref={setMap}
    >
      {mapView === 'street' ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
      ) : (
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      )}
      <Marker position={position}>
        <Popup>
          {popupText || 'The property is here.'}
        </Popup>
      </Marker>

      {amenities && amenities.map((amenity) => (
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

      {activeAmenity && (
        <Marker 
          position={[activeAmenity.lat, activeAmenity.lng]} 
          icon={L.divIcon({
            className: 'custom-amenity-marker',
            html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })}
        >
          <Popup>
            <h4>{activeAmenity.name}</h4>
            <p>Distance: {activeAmenity.distance}</p>
          </Popup>
        </Marker>
      )}

      {pathToAmenity && pathToAmenity.length === 2 && (
        <Polyline positions={pathToAmenity} color="blue" weight={5} opacity={0.7} dashArray="10, 10" />
      )}
    </MapContainer>
  );
};

export default Map;