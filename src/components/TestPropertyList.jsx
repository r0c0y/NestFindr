import React from 'react';
import listingsData from '../data/listingsData';

const TestPropertyList = () => {
  console.log('TestPropertyList - listingsData:', listingsData);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Property List</h2>
      <p>Number of properties: {listingsData.length}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {listingsData.map(property => (
          <div key={property.id} style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <h3>{property.title}</h3>
            <p>{property.address}</p>
            <p>Price: ₹{property.price.toLocaleString()}</p>
            <p>Type: {property.type}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            {property.imageUrl && (
              <img 
                src={property.imageUrl} 
                alt={property.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPropertyList;
