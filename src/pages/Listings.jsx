import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useProperties from '../hooks/useProperties';
import useBookmarks from '../hooks/useBookmarks.jsx';
import useDebounce from '../hooks/useDebounce';
import ListingsHeader from '../components/Listings/ListingsHeader';
import FilterBar from '../components/Listings/FilterBar';
import PropertyList from '../components/Listings/PropertyList';
import NoResults from '../components/Listings/NoResults';
import Pagination from '../components/Pagination';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import Modal from '../components/Modal';
import PropertyDetails from './PropertyDetails';
import '../styles/Listings.css';

const PROPERTIES_PER_PAGE = 6;

const Listings = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterBeds, setFilterBeds] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms debounce
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  // 'filters' and 'setFilters' are not used, so do not declare them.
  // If you want to use a single filters state object instead of individual filter states, 
  // you can refactor the code. For now, keep the current approach and do not add unused variables.
  const { properties, loading: propertiesLoading, error: propertiesError, dataSource } = useProperties(sortBy, filterPrice, filterType, filterBeds, debouncedSearchQuery);
  const { bookmarkedIds, toggleBookmark, loading: bookmarksLoading, error: bookmarksError } = useBookmarks();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterPrice, filterType, filterBeds, debouncedSearchQuery]);

  const handleCalculate = (propertyId, price, title) => {
    navigate(`/calculator?price=${price}&property=${encodeURIComponent(title)}`);
  };

  const handlePropertyClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const closeModal = () => {
    setSelectedPropertyId(null);
  };

  // Advanced filtering with useMemo for performance
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    
    return properties.filter(property => {
      // Search filter
      const matchesSearch = !debouncedSearchQuery || 
        property.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (property.location && property.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
      
      // Price filter
      const matchesPrice = filterPrice === 'all' || (() => {
        const [min, max] = filterPrice.split('-').map(Number);
        return property.price >= min && (max ? property.price <= max : true);
      })();
      
      // Type filter
      const matchesType = filterType === 'all' || property.type === filterType;
      
      // Beds filter
      const matchesBeds = filterBeds === 'all' || (() => {
        if (filterBeds === '3') return property.bedrooms >= 3;
        return property.bedrooms === Number(filterBeds);
      })();
      
      return matchesSearch && matchesPrice && matchesType && matchesBeds;
    });
  }, [properties, debouncedSearchQuery, filterPrice, filterType, filterBeds]);

  const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);

  const loading = propertiesLoading || bookmarksLoading;

  if (loading) {
    return (
      <div className="listings-container">
        <ListingsHeader dataSource={dataSource} />
        <FilterBar 
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterPrice={filterPrice}
          setFilterPrice={setFilterPrice}
          filterType={filterType}
          setFilterType={setFilterType}
          filterBeds={filterBeds}
          setFilterBeds={setFilterBeds}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterLoading={true}
        />
        <div className="properties-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (propertiesError || bookmarksError) {
    return (
      <div className="listings-container">
        <div className="listings-error">
          <h2>Error Loading Properties</h2>
          <p>{propertiesError || bookmarksError}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-container">
      <ListingsHeader dataSource={dataSource} />
      <FilterBar 
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        filterType={filterType}
        setFilterType={setFilterType}
        filterBeds={filterBeds}
        setFilterBeds={setFilterBeds}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterLoading={loading}
      />
      {filteredProperties.length === 0 ? (
        <NoResults setFilterPrice={setFilterPrice} />
      ) : (
        <>
          <PropertyList 
            properties={currentProperties}
            loading={false}
            bookmarkedIds={bookmarkedIds}
            handleBookmarkToggle={(propertyId) => {
              if (!bookmarksLoading) {
                toggleBookmark(propertyId);
              }
            }}
            handleCalculate={handleCalculate}
            onPropertyClick={handlePropertyClick}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
      
      {/* Property Details Modal */}
      <Modal 
        isOpen={!!selectedPropertyId} 
        onClose={closeModal}
        title="Property Details"
      >
        {selectedPropertyId && (
          <PropertyDetails 
            id={selectedPropertyId} 
            onClose={closeModal} 
          />
        )}
      </Modal>
    </div>
  );
};

export default Listings;
