import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import '../styles/Listings.css';

const dummyProperties = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  image: `https://via.placeholder.com/300x200?text=Property+${i + 1}`,
  title: `Property ${i + 1}`,
  address: `Sector ${i + 1}, City`,
  price: `${50 + i} Lakh`,
  date: `2025-05-${(i % 30) + 1}`,
}));

const Listings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;
  const totalPages = Math.ceil(dummyProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = dummyProperties.slice(startIndex, startIndex + propertiesPerPage);

  const handlePageClick = (pageNum) => setCurrentPage(pageNum);
  const handleNext = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(p => p - 1);

  const visiblePages = [...Array(totalPages).keys()]
    .map(i => i + 1)
    .filter(p => Math.abs(p - currentPage) <= 2);

  return (
    <div className="listings-page">
      <h2>Property Listings</h2>
      <div className="properties-grid">
        {currentProperties.map(prop => (
          <PropertyCard key={prop.id} {...prop} />
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
        {visiblePages.map(p => (
          <button
            key={p}
            className={p === currentPage ? 'active-page' : ''}
            onClick={() => handlePageClick(p)}
          >
            {p}
          </button>
        ))}
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Listings;
