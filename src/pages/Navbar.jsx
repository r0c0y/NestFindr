import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">NestFindr</Link>
      <div className="navbar-links">
        <Link to="/listings" className="navbar-link">Listings</Link>
        <Link to="/calculator" className="navbar-link">Calculator</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
      </div>
    </nav>
  );
};
export default Navbar;
