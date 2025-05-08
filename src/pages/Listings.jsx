import React, { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import '../styles/Listings.css';

const dummyProperties = Array.from({ length: 180 }, (_, i) => ({
  id: i + 1,
  image: `https://via.placeholder.com/300x200?text=Property+${i + 1}`,
  title: `Property ${i + 1}`,
  address: `Sector ${i + 1}, City`,
  price: `${50 + i} Lakh`,
  date: `2025-05-${(i % 30) + 1 < 10 ? '0' : ''}${(i % 30) + 1}`,
}));

const Listings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8; // Increased from 6 to 8
  const totalPages = Math.ceil(dummyProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = dummyProperties.slice(startIndex, startIndex + propertiesPerPage);

  const handlePageClick = (pageNum) => setCurrentPage(pageNum);
  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  const getPaginationItems = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      pages.push('...');
    }

    return pages;
  };

  return (
    <div className="listings-container">
      <h1 className="listings-title">Property Listings</h1>
      <div className="properties-grid">
        {currentProperties.map((prop, index) => (
          <PropertyCard key={prop.id} {...prop} index={index} />
        ))}
      </div>
      <div className="pagination">
        <button
          className="pagination-button nav-button"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Prev
        </button>
        {getPaginationItems().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-button page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          className="pagination-button nav-button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Listings;