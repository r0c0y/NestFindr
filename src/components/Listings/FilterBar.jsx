import React from 'react';

const FilterBar = ({ 
  sortBy, setSortBy, 
  filterPrice, setFilterPrice, 
  filterType, setFilterType,
  filterBeds, setFilterBeds,
  searchQuery, setSearchQuery,
  filterLoading 
}) => (
  <div className="listings-filters-container">
    <div className="search-bar">
      <input 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by keyword, location, or title..."
        className="search-input"
        disabled={filterLoading}
      />
    </div>
    <div className="filter-bar">
      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
        disabled={filterLoading}
      >
        <option value="date">Latest First</option>
        <option value="price">Price: High to Low</option>
        <option value="-price">Price: Low to High</option>
      </select>

      <select 
        value={filterPrice} 
        onChange={(e) => setFilterPrice(e.target.value)}
        className="filter-select"
        disabled={filterLoading}
      >
        <option value="all">All Prices</option>
        <option value="0-2500000">Under ₹25L</option>
        <option value="2500000-5000000">₹25L - ₹50L</option>
        <option value="5000000-10000000">₹50L - ₹1Cr</option>
        <option value="10000000">Above ₹1Cr</option>
      </select>

      <select 
        value={filterType} 
        onChange={(e) => setFilterType(e.target.value)}
        className="filter-select"
        disabled={filterLoading}
      >
        <option value="all">All Types</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="House">House</option>
      </select>

      <select 
        value={filterBeds} 
        onChange={(e) => setFilterBeds(e.target.value)}
        className="filter-select"
        disabled={filterLoading}
      >
        <option value="all">All Bedrooms</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3+ BHK</option>
      </select>
    </div>
  </div>
);

export default FilterBar;
