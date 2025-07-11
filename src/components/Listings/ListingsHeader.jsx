import React from 'react';

const ListingsHeader = ({ dataSource }) => (
  <div className="listings-header">
    <h1 className="listings-title">Property Listings</h1>
    {dataSource === 'local' && (
      <div className="data-source-badge">
        Using Local Data
      </div>
    )}
  </div>
);

export default ListingsHeader;
