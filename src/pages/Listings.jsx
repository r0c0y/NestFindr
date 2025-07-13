import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertiesStart, fetchPropertiesSuccess, fetchPropertiesFailure } from '../store/propertiesSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { addToCompare, removeFromCompare } from '../store/comparisonSlice';

import ListingsHeader from '../components/Listings/ListingsHeader';
import FilterBar from '../components/Listings/FilterBar';
import PropertyList from '../components/Listings/PropertyList';
import NoResults from '../components/Listings/NoResults';
import Pagination from '../components/Pagination';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import Modal from '../components/Modal';
import PropertyDetails from './PropertyDetails';

import toast from 'react-hot-toast';
import '../styles/Listings.css';

const PROPERTIES_PER_PAGE = 6;
toast;

const Listings = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterBeds, setFilterBeds] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = searchQuery; // No debounce hook needed for now
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  
  const dispatch = useDispatch();
  const { listings: properties, loading, error } = useSelector((state) => state.properties);
  const { favorites: bookmarkedIds } = useSelector((state) => state.favorites);
  const { compareList } = useSelector((state) => state.comparison);

  // Mock data fetching for now, replace with actual API call later
  useEffect(() => {
    dispatch(fetchPropertiesStart());
    try {
      // Simulate API call with enhanced mock data
const mockProperties = [
        { 
          id: '4', 
          title: 'Luxury Villa', 
          address: '890 Sunset Blvd', 
          location: 'Miami', 
          price: 120000000, 
          type: 'villa', 
          bedrooms: 5, 
          bathrooms: 4,
          area: 3500,
          imageUrl: 'https://images.unsplash.com/photo-1600573471013-56be10a8f656?w=600h=400fit=crop',
          imageUrls: [
            'https://images.unsplash.com/photo-1600573471013-56be10a8f656?w=600h=400fit=crop',
            'https://images.unsplash.com/photo-1600585152516-48c7b3f2eda4?w=600h=400fit=crop',
            'https://images.unsplash.com/photo-1600583699930-e2f1db21a63-49.jpg?w=600h=400fit=crop'
          ],
          description: 'A luxurious villa in Miami with private swimming pool and stunning ocean views.',
          amenities: ['Swimming Pool', 'Garage', 'Garden', 'Security System', 'Balcony'],
          lat: 25.7617,
          lng: -80.1918,
          date: '2024-01-20'
        },
        { 
          id: '5', 
          title: 'Charming Cottage', 
          address: '212 Country Rd', 
          location: 'Nashville', 
          price: 35000000, 
          type: 'cottage', 
          bedrooms: 3, 
          bathrooms: 2,
          area: 1800,
          imageUrl: 'https://images.unsplash.com/photo-1503240778100-5cbf71477615?w=600h=400fit=crop',
          imageUrls: [
            'https://images.unsplash.com/photo-1503240778100-5cbf71477615?w=600h=400fit=crop',
            'https://images.unsplash.com/photo-1503287408825-4d7be242c37e?w=600h=400fit=crop',
            'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600h=400fit=crop'
          ],
          description: 'A charming cottage with a cozy interior and lush garden. Ideal for a family getaway.',
          amenities: ['Garden', 'Fireplace', 'Patio', 'Air Conditioning'],
          lat: 36.1744,
          lng: -86.7679,
          date: '2024-01-25'
        },
        { 
          id: '6', 
          title: 'Urban Flat', 
          address: '1010 Brickell Ave', 
          location: 'Miami', 
          price: 70000000, 
          type: 'flat', 
          bedrooms: 2, 
          bathrooms: 2,
          area: 1000,
          imageUrl: 'https://images.unsplash.com/photo-1527176930608-e349d87c07b6?w=600h=400fit=crop',
          imageUrls: [
            'https://images.unsplash.com/photo-1527176930608-e349d87c07b6?w=600h=400fit=crop',
            'https://images.unsplash.com/photo-1527285732709-e09e6dfc7a67?w=600h=400fit=crop',
            'https://images.unsplash.com/photo-1527271992092-67d203ba1e5d?w=600h=400fit=crop'
          ],
          description: 'An urban flat in downtown Miami with modern amenities and great city views.',
          amenities: ['Gym', 'Concierge', 'Security', 'Elevator'],
          lat: 25.7617,
          lng: -80.1918,
          date: '2024-02-01'
        },
        { 
          id: '1', 
          title: 'Modern Apartment', 
          address: '123 Main St', 
          location: 'New York', 
          price: 50000000, 
          type: 'apartment', 
          bedrooms: 2, 
          bathrooms: 2,
          area: 1200,
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
          imageUrls: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
          ],
          description: 'A stunning modern apartment in the heart of Manhattan with panoramic city views, high-end finishes, and luxury amenities.',
          amenities: ['Gym', 'Swimming Pool', 'Parking', 'Balcony', 'Air Conditioning', 'Elevator'],
          lat: 40.7589,
          lng: -73.9851,
          date: '2024-01-15'
        },
        { 
          id: '2', 
          title: 'Spacious House', 
          address: '456 Oak Ave', 
          location: 'Los Angeles', 
          price: 80000000, 
          type: 'house', 
          bedrooms: 4, 
          bathrooms: 3,
          area: 2500,
          imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
          imageUrls: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop'
          ],
          description: 'Beautiful family home with spacious rooms, large backyard, and modern kitchen. Perfect for growing families.',
          amenities: ['Garden', 'Garage', 'Fireplace', 'Patio', 'Central Heating', 'Storage Room'],
          lat: 34.0522,
          lng: -118.2437,
          date: '2024-01-10'
        },
        { 
          id: '3', 
          title: 'Cozy Condo', 
          address: '789 Pine Ln', 
          location: 'Chicago', 
          price: 30000000, 
          type: 'condo', 
          bedrooms: 1, 
          bathrooms: 1,
          area: 800,
          imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
          imageUrls: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
          ],
          description: 'Charming condo in downtown Chicago with modern amenities and easy access to public transportation.',
          amenities: ['Concierge', 'Laundry', 'Internet', 'Security', 'Furnished'],
          lat: 41.8781,
          lng: -87.6298,
          date: '2024-01-05'
        },
      ];
      dispatch(fetchPropertiesSuccess(mockProperties));
    } catch (err) {
      dispatch(fetchPropertiesFailure(err.message));
    }
  }, [dispatch]);
  

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

  console.log('Listings Debug:', {
    properties: properties.length,
    filteredProperties: filteredProperties.length,
    currentProperties: currentProperties.length,
    loading,
    dataSource: 'redux' // Updated dataSource
  });

  const handleBookmarkToggle = (property) => {
    if (bookmarkedIds.some(fav => fav.id === property.id)) {
      dispatch(removeFavorite(property));
    } else {
      dispatch(addFavorite(property));
    }
  };

  const handleAddToCompare = (property) => {
    dispatch(addToCompare(property));
  };

  const handleRemoveFromCompare = (property) => {
    dispatch(removeFromCompare(property));
  };

  const isInCompare = (propertyId) => {
    return compareList.some(item => item.id === propertyId);
  };

  if (loading) {
    return (
      <div className="listings-container">
        <ListingsHeader 
          dataSource={'redux'} // Updated dataSource
        />
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

  if (error) {
    return (
      <div className="listings-container">
        <div className="listings-error">
          <h2>Error Loading Properties</h2>
          <p>{error?.message || error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-container">
      <ListingsHeader 
        dataSource={'redux'} // Updated dataSource
      />
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
            handleBookmarkToggle={handleBookmarkToggle}
            handleCalculate={handleCalculate}
            onPropertyClick={handlePropertyClick}
            addToCompare={handleAddToCompare}
            removeFromCompare={handleRemoveFromCompare}
            isInCompare={isInCompare}
            compareList={compareList}
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
