import React from 'react';
import { FaSearchMinus } from 'react-icons/fa';

const NoResults = ({ setFilterPrice }) => (
  <div className="no-results-container">
    <FaSearchMinus className="no-results-icon" />
    <h2>No Properties Found</h2>
    <p>We couldn't find any properties matching your current filters.</p>
    <button onClick={() => setFilterPrice('all')} className="reset-filters-btn">
      Clear All Filters
    </button>
  </div>
);

export default NoResults;
