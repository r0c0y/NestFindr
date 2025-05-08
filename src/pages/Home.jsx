import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to NestFindr</h1>
        <p className="hero-subtitle">
          Discover your dream home with ease—explore listings, calculate mortgages, and more!
        </p>
        <Link to="/listings">
          <button className="hero-button">Explore Listings</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;