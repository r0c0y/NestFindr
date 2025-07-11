import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProperties from '../hooks/useProperties';
import useBookmarks from '../hooks/useBookmarks.jsx';
import useDebounce from '../hooks/useDebounce';
import ListingsHeader from '../components/Listings/ListingsHeader';
import FilterBar from '../components/Listings/FilterBar';
import PropertyList from '../components/Listings/PropertyList';
import NoResults from '../components/Listings/NoResults';
import Pagination from '../components/Pagination';
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

  const { properties, loading: propertiesLoading, error: propertiesError, dataSource } = useProperties(sortBy, filterPrice, filterType, filterBeds, debouncedSearchQuery);
  const { bookmarkedIds, toggleBookmark, loading: bookmarksLoading, error: bookmarksError } = useBookmarks();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterPrice, filterType, filterBeds, debouncedSearchQuery]);

  const handleCalculate = (propertyId, price, title) => {
    navigate(`/calculator?price=${price}&property=${encodeURIComponent(title)}`);
  };

  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const currentProperties = properties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);

  const loading = propertiesLoading || bookmarksLoading;

  if (loading) {
    return (
      <div className="listings-container">
        <ListingsHeader dataSource={dataSource} />
        <PropertyList loading={true} />
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
      {properties.length === 0 ? (
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
    </div>
  );
};

export default Listings;
