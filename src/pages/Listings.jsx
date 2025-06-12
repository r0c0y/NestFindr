import React, { useState /*, useEffect */ } from 'react';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';
import '../styles/Listings.css';

// Large dummy array for many pages
const dummyProperties = Array.from({ length: 180 }, (_, i) => ({
  id: i + 1,
  image: `https://via.placeholder.com/300x200?text=Property+${i + 1}`,
  title: `Property ${i + 1}`,
  address: `Sector ${i + 1}, City`,
  price: 5000000 + i * 100000,
  date: `2025-05-${(i % 30) + 1 < 10 ? '0' : ''}${(i % 30) + 1}`,
}));

const Listings = () => {
  const [properties] = useState(dummyProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;

  // --- API logic: Uncomment this block when your API is ready ---
  /*
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
        } else {
          setProperties(dummyProperties); // fallback to dummy if API returns empty
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setProperties(dummyProperties); // fallback to dummy on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  */
  // --- End API logic ---

  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = properties.slice(startIndex, startIndex + propertiesPerPage);

  return (
    <div className="listings-container">
      <h1 className="listings-title">Property Listings</h1>
      <div className="properties-grid">
        {currentProperties.length === 0 ? (
          <div className="no-properties">No properties found.</div>
        ) : (
          currentProperties.map((prop, index) => (
            <PropertyCard key={prop.id} {...prop} index={index} />
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Listings;