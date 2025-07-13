import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css'; // Assuming you'll create this CSS file

const NotFound = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div className="not-found-actions">
        <Link to="/" className="home-button">Go to Home</Link>
        <button onClick={handleRefresh} className="refresh-button">Refresh Page</button>
      </div>
    </div>
  );
};

export default NotFound;