import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBarChart2 } from 'react-icons/fi';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = { uid: 'mockUserId', displayName: 'Guest User', email: 'guest@example.com' }; // Mock user for now
  const compareList = useSelector((state) => state.comparison.compareList);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        <Link to="/" className="navbar-logo">NestFindr</Link>
        <span className="dashboard-hover home-hover">Home</span>
      </div>
      <div className="navbar-links">
        <Link to="/listings" className={`navbar-link${location.pathname === '/listings' ? ' active' : ''}`}>Listings</Link>
        <Link to="/calculator" className={`navbar-link${location.pathname === '/calculator' ? ' active' : ''}`}>Calculator</Link>
        <Link to="/compare" className={`navbar-link comparison-link${location.pathname === '/compare' ? ' active' : ''}`}>
          <FiBarChart2 />
          Compare
          {compareList.length > 0 && (
            <span className="comparison-badge">{compareList.length}</span>
          )}
        </Link>
        <Link to="/about" className={`navbar-link${location.pathname === '/about' ? ' active' : ''}`}>About</Link>
        <Link to="/contact" className={`navbar-link${location.pathname === '/contact' ? ' active' : ''}`}>Contact</Link>
        <span className="navbar-divider" />
        {!user ? (
          <Link to="/login" className="navbar-signin-btn">Sign In</Link>
        ) : (
          <div
            className="navbar-avatar"
            title="Dashboard"
            onClick={() => navigate('/dashboard')}
            tabIndex={0}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <span className="avatar-circle">
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                : getInitials(user.displayName || user.email)}
            </span>
            <span className="dashboard-hover">Dashboard</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;