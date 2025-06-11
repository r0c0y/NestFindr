import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">NestFindr</Link>
      <div className="navbar-links">
        <Link to="/listings" className={`navbar-link${location.pathname === '/listings' ? ' active' : ''}`}>Listings</Link>
        <Link to="/calculator" className={`navbar-link${location.pathname === '/calculator' ? ' active' : ''}`}>Calculator</Link>
        <Link to="/about" className={`navbar-link${location.pathname === '/about' ? ' active' : ''}`}>About</Link>
        <Link to="/contact" className={`navbar-link${location.pathname === '/contact' ? ' active' : ''}`}>Contact</Link>
      </div>
    </nav>
  );
};
export default Navbar;
