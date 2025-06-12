import React from 'react';

const getPaginationItems = (currentPage, totalPages) => {
  const maxPagesToShow = 5;
  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push('...');
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }
  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination" role="navigation" aria-label="Pagination Navigation">
    <button
      className="pagination-button nav-button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      aria-label="Previous page"
    >
      Prev
    </button>
    {getPaginationItems(currentPage, totalPages).map((page, idx) =>
      page === '...' ? (
        <span key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">
          ...
        </span>
      ) : (
        <button
          key={page}
          className={`pagination-button page-number${currentPage === page ? ' active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      )
    )}
    <button
      className="pagination-button nav-button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      aria-label="Next page"
    >
      Next
    </button>
  </div>
);

export default Pagination;
