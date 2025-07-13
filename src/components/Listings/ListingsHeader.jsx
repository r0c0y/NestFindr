import React from 'react';

const ListingsHeader = ({ dataSource, onSeedFirebase, isSeeding, hasFirebaseData }) => (
  <div className="listings-header">
    <div className="header-content">
      <h1 className="listings-title">Property Listings</h1>
      {dataSource === 'local' && (
        <div className="data-source-badge">
          Using Local Data
        </div>
      )}
    </div>
    {!hasFirebaseData && (
      <button 
        onClick={onSeedFirebase}
        disabled={isSeeding}
        className="seed-button"
      >
        {isSeeding ? 'Seeding...' : 'Load Sample Data'}
      </button>
    )}
  </div>
);

export default ListingsHeader;
