import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import Pagination from '../components/Pagination';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  where 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import listingsData from '../data/listingsData';
import '../styles/Listings.css';

// Constants for pagination and query limits
const PROPERTIES_PER_PAGE = 8;
const PROPERTIES_PER_QUERY = 200;

const Listings = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);
  const [bookmarkSavedId, setBookmarkSavedId] = useState(null);
  const [bookmarkRemovedId, setBookmarkRemovedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [filterPrice, setFilterPrice] = useState('all');
  const [dataSource, setDataSource] = useState('loading'); // 'firestore', 'local', or 'loading'
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Helper to generate enough unique dummy properties, but keep original details for bookmarked ones and always match filter
  function generateFilteredDummyPropertiesWithBookmarks(bookmarkedIds, originalData, count, filterFn) {
    // Map of id -> property for originals
    const originalMap = {};
    originalData.forEach(p => { originalMap[p.id] = p; });

    // Start with filtered originals
    let filtered = originalData.filter(filterFn);
    let result = [...filtered];

    // If not enough, generate more (but only if they match the filter)
    let idx = 0;
    while (result.length < count) {
      const base = originalData[idx % originalData.length];
      // Generate a new property based on base, but only if it matches the filter
      let newId = `${base.id || idx}-${result.length + 1}`;
      let newProp = {
        ...base,
        id: newId,
        title: `${base.title || 'Property'} #${result.length + 1}`
      };
      // Avoid duplicating bookmarked property ids and only add if matches filter
      if (!originalMap[newId] && !bookmarkedIds.has(newId) && filterFn(newProp)) {
        result.push(newProp);
      }
      idx++;
      // Prevent infinite loop if not enough matches
      if (idx > 1000) break;
    }

    // Ensure all bookmarked properties (by id) are present with their original details
    bookmarkedIds.forEach(bid => {
      if (!result.find(p => p.id === bid) && originalMap[bid]) {
        result.unshift(originalMap[bid]);
      }
    });

    return result.slice(0, count);
  }

  // Fetch properties with fallback to dummy data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        if (loading) setLoading(true);
        else setFilterLoading(true);
        setError(null);

        // Try Firestore first
        try {
          console.log("Attempting to fetch from Firestore...");
          // Create optimized query that combines sorting and filtering
          const propertiesRef = collection(db, 'properties');
          let propertyQuery;
          
          // Build query based on price filter and sort options
          if (filterPrice !== 'all') {
            // Parse min and max prices from filter value
            const [min, max] = filterPrice.split('-').map(Number);
            
            // Create query with price filter and appropriate sort
            if (sortBy === 'price') {
              propertyQuery = query(
                propertiesRef,
                where('price', '>=', min),
                ...(max ? [where('price', '<=', max)] : []),
                orderBy('price', 'desc'),
                limit(PROPERTIES_PER_QUERY)
              );
            } else if (sortBy === '-price') {
              propertyQuery = query(
                propertiesRef,
                where('price', '>=', min),
                ...(max ? [where('price', '<=', max)] : []),
                orderBy('price', 'asc'),
                limit(PROPERTIES_PER_QUERY)
              );
            } else {
              // Default to date sorting with price filter
              propertyQuery = query(
                propertiesRef,
                where('price', '>=', min),
                ...(max ? [where('price', '<=', max)] : []),
                orderBy('createdAt', 'desc'),
                limit(PROPERTIES_PER_QUERY)
              );
            }
          } else {
            // No price filter, just sort
            if (sortBy === 'price') {
              propertyQuery = query(
                propertiesRef,
                orderBy('price', 'desc'),
                limit(PROPERTIES_PER_QUERY)
              );
            } else if (sortBy === '-price') {
              propertyQuery = query(
                propertiesRef,
                orderBy('price', 'asc'),
                limit(PROPERTIES_PER_QUERY)
              );
            } else {
              // Default to date sorting
              propertyQuery = query(
                propertiesRef,
                orderBy('createdAt', 'desc'),
                limit(PROPERTIES_PER_QUERY)
              );
            }
          }
          
          const snapshot = await getDocs(propertyQuery);
          
          if (!snapshot.empty) {
            // Process results with proper type checking
            const propertyList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Format date if available
              date: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A',
              // Ensure price is a number
              price: typeof doc.data().price === 'number' 
                ? doc.data().price 
                : Number(doc.data().price) || 0
            }));
            
            setProperties(propertyList);
            setDataSource('firestore');
            console.log("Successfully loaded data from Firestore");
          } else {
            // No data in Firestore, use dummy data
            throw new Error("No properties found in Firestore");
          }
        } catch (firestoreErr) {
          console.log("Firestore fetch failed, using dummy data", firestoreErr);
          
          // Use dummy data as fallback
          let filteredData = [...listingsData];

          // 1. Price filter
          const priceFilterFn = (property) => {
            if (filterPrice === 'all') return true;
            const [min, max] = filterPrice.split('-').map(Number);
            if (max) return property.price >= min && property.price <= max;
            return property.price >= min;
          };
          filteredData = filteredData.filter(priceFilterFn);

          // 2. Sort filter
          if (sortBy === 'price') {
            filteredData.sort((a, b) => b.price - a.price);
          } else if (sortBy === '-price') {
            filteredData.sort((a, b) => a.price - b.price);
          } else {
            filteredData.sort((a, b) => {
              const dateA = new Date(a.date || a.createdAt);
              const dateB = new Date(b.date || b.createdAt);
              return dateB - dateA;
            });
          }

          // 3. Generate enough properties, but only those matching filter
          filteredData = generateFilteredDummyPropertiesWithBookmarks(
            bookmarkedIds,
            listingsData,
            200,
            priceFilterFn
          );

          setProperties(filteredData);
          setDataSource('local');
          console.log("Using local dummy data");
        }
        
        // Reset to first page when filters/sort change
        setCurrentPage(1);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        
        // Still try to use dummy data even if everything fails
        const priceFilterFn = (property) => {
          if (filterPrice === 'all') return true;
          const [min, max] = filterPrice.split('-').map(Number);
          if (max) return property.price >= min && property.price <= max;
          return property.price >= min;
        };
        let fallbackData = generateFilteredDummyPropertiesWithBookmarks(
          bookmarkedIds,
          listingsData,
          200,
          priceFilterFn
        );
        setProperties(fallbackData);
        setDataSource('local');
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    };

    fetchProperties();
    // Add bookmarkedIds to dependency so bookmarked cards always appear
  }, [sortBy, filterPrice, bookmarkedIds]);

  // Fetch user's bookmarks with limit
  useEffect(() => {
    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }
    
    const fetchBookmarks = async () => {
      try {
        // Add limit to bookmark query for better performance
        const bookmarksQuery = query(
          collection(db, `users/${user.uid}/bookmarkedProperties`),
          limit(100) // Reasonable limit for bookmarks
        );
        const bookmarkSnapshot = await getDocs(bookmarksQuery);
        setBookmarkedIds(new Set(bookmarkSnapshot.docs.map(doc => doc.id)));
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      }
    };
    
    fetchBookmarks();
  }, [user]);

  // Handle mortgage calculator button click
  const handleCalculate = (propertyId, price, title) => {
    navigate(`/calculator?price=${price}&property=${encodeURIComponent(title)}`);
  };
  
  // Handle add reminder button click
  const handleAddReminder = (propertyId, price, title) => {
    if (!user) {
      setShowLoginPrompt(true);
      // Hide login prompt after 3 seconds
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    
    // User is logged in, add reminder to dashboard
    try {
      const monthlyPayment = (price * 0.0074).toFixed(2); // Simple calculation for demo
      const reminderDoc = doc(db, `users/${user.uid}/reminders`, propertyId);
      setDoc(reminderDoc, {
        propertyId,
        propertyTitle: title,
        amount: monthlyPayment,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        createdAt: new Date()
      });
      
      alert(`Monthly mortgage reminder of ₹${monthlyPayment} added to your dashboard!`);
    } catch (err) {
      console.error('Error adding reminder:', err);
      alert('Failed to add reminder. Please try again.');
    }
  };
  
  const handleBookmarkToggle = async (propertyId) => {
    if (!user) {
      alert("Please log in to bookmark properties!");
      return;
    }
    
    setBookmarkLoadingId(propertyId);
    setBookmarkSavedId(null);
    setBookmarkRemovedId(null);
    
    try {
      const bookmarkRef = doc(db, `users/${user.uid}/bookmarkedProperties`, propertyId);
      const newBookmarkedIds = new Set(bookmarkedIds);
      
      if (newBookmarkedIds.has(propertyId)) {
        // Remove bookmark
        newBookmarkedIds.delete(propertyId);
        await deleteDoc(bookmarkRef);
        setBookmarkedIds(newBookmarkedIds);
        setBookmarkRemovedId(propertyId);
        setTimeout(() => setBookmarkRemovedId(null), 2500);
      } else {
        // Add bookmark
        newBookmarkedIds.add(propertyId);
        await setDoc(bookmarkRef, { 
          bookmarkedAt: new Date(),
          propertyId
        });
        setBookmarkedIds(newBookmarkedIds);
        setBookmarkSavedId(propertyId);
        setTimeout(() => setBookmarkSavedId(null), 2500);
      }
    } catch (err) {
      // Fallback to local bookmarks if Firestore fails
      let localBookmarks = new Set(JSON.parse(localStorage.getItem('localBookmarks') || '[]'));
      if (localBookmarks.has(propertyId)) {
        localBookmarks.delete(propertyId);
        setBookmarkRemovedId(propertyId);
        setTimeout(() => setBookmarkRemovedId(null), 2500);
      } else {
        localBookmarks.add(propertyId);
        setBookmarkSavedId(propertyId);
        setTimeout(() => setBookmarkSavedId(null), 2500);
      }
      setBookmarkedIds(localBookmarks);
      localStorage.setItem('localBookmarks', JSON.stringify(Array.from(localBookmarks)));
    } finally {
      setBookmarkLoadingId(null);
    }
  };
  
  // Calculate pagination values using constant
  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);
  const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
  const currentProperties = properties.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);

  // Show loading state with skeleton cards
  if (loading) {
    return (
      <div className="listings-container">
        <div className="listings-header">
          <h1 className="listings-title">Property Listings</h1>
          <div className="listings-subtitle">
            <p>Finding properties for you...</p>
          </div>
        </div>
        
        <div className="properties-grid" aria-busy="true" aria-label="Loading properties">
          {Array.from({ length: PROPERTIES_PER_PAGE }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show error state ONLY if there was a real fetch error (not just "no results")
  if (error && properties.length === 0) {
    return (
      <div className="listings-container">
        <div className="listings-error">
          <h2>Error Loading Properties</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show "no results" if filter yields no properties
  if (!loading && !filterLoading && properties.length === 0) {
    return (
      <div className="listings-container">
        <div className="no-results">
          <h2>No Properties Found</h2>
          <p>No properties exist on the platform for your selected filters.</p>
          <button onClick={() => setFilterPrice('all')} className="retry-button">
            Show All Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-container">
      {showLoginPrompt && (
        <div className="login-prompt">
          <p>Please log in to add mortgage reminders to your dashboard</p>
        </div>
      )}
      
      <div className="listings-header">
        <h1 className="listings-title">Property Listings</h1>
        {dataSource === 'local' && (
          <div className="data-source-badge">
            Using Local Data
          </div>
        )}
        <div className="listings-filters">
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
        </div>
      </div>

      {filterLoading ? (
        <div className="properties-grid" aria-busy="true" aria-label="Updating properties">
          {Array.from({ length: PROPERTIES_PER_PAGE }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="no-results">
          No properties found matching your criteria.
        </div>
      ) : (
        <>
          <div className="properties-grid">
            {currentProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                {...prop}
                isBookmarked={bookmarkedIds.has(prop.id)}
                onBookmark={() => handleBookmarkToggle(prop.id)}
                bookmarkLoading={bookmarkLoadingId === prop.id}
                bookmarkSaved={bookmarkSavedId === prop.id}
                bookmarkRemoved={bookmarkRemovedId === prop.id}
                onCalculate={() => handleCalculate(prop.id, prop.price, prop.title)}
                // Removed onAddReminder and showReminderButton
              />
            ))}
          </div>
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
