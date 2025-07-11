
import React from 'react';
import { FaEye, FaBookmark, FaPhone } from 'react-icons/fa';

const Stats = () => (
  <div className="dashboard-stats-grid">
    <div className="dashboard-stat-card">
      <FaEye className="dashboard-stat-icon" />
      <p className="dashboard-stat-number">125</p>
      <p className="dashboard-stat-label">Viewed</p>
    </div>
    <div className="dashboard-stat-card">
      <FaBookmark className="dashboard-stat-icon" />
      <p className="dashboard-stat-number">28</p>
      <p className="dashboard-stat-label">Bookmarked</p>
    </div>
    <div className="dashboard-stat-card">
      <FaPhone className="dashboard-stat-icon" />
      <p className="dashboard-stat-number">12</p>
      <p className="dashboard-stat-label">Contacted</p>
    </div>
  </div>
);

export default Stats;
