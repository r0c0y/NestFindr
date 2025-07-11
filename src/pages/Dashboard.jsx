import React from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Profile from '../components/Dashboard/Profile';
import Bookmarks from '../components/Dashboard/Bookmarks';
import Preferences from '../components/Dashboard/Preferences';
import Reminders from '../components/Dashboard/Reminders';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Dashboard</h2>
      <nav className="dashboard-nav">
        <NavLink to="profile" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Profile</NavLink>
        <NavLink to="bookmarks" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>My Bookmarks</NavLink>
        <NavLink to="preferences" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Preferences & Alerts</NavLink>
        <NavLink to="reminders" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'}>Mortgage Reminders</NavLink>
      </nav>
      <div className="dashboard-content">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookmarks" element={<Bookmarks user={user} />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="reminders" element={<Reminders />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
