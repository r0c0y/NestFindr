import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Profile from '../components/Dashboard/Profile';
import Bookmarks from '../components/Dashboard/Bookmarks';
import Preferences from '../components/Dashboard/Preferences';
import Reminders from '../components/Dashboard/Reminders';
import DashboardOverview from '../components/Dashboard/DashboardOverview'; // New component for overview
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>; // Or a spinner component
  }

  if (!currentUser) {
    return (
      <div className="dashboard-guest-message">
        <h2>Please log in or sign up to view your dashboard.</h2>
        <p>Access personalized statistics, bookmarks, and more.</p>
        <div className="dashboard-guest-actions">
          <NavLink to="/login" className="dashboard-button">Login</NavLink>
          <NavLink to="/signup" className="dashboard-button">Sign Up</NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-main-title">Welcome, {currentUser.displayName || currentUser.email}!</h2>
      <button onClick={logout} className="dashboard-logout-button">Logout</button>
      <nav className="dashboard-nav">
        <NavLink to="overview" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Overview</NavLink>
        <NavLink to="profile" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Profile</NavLink>
        <NavLink to="bookmarks" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>My Bookmarks</NavLink>
        <NavLink to="preferences" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Preferences & Alerts</NavLink>
        <NavLink to="reminders" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Mortgage Reminders</NavLink>
        <NavLink to="compare" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Property Comparison</NavLink>
      </nav>
      <div className="dashboard-content">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="compare" element={<Navigate to="/compare" replace />} /> {/* Redirect to main compare page */}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;