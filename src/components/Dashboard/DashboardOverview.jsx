import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaListUl, FaCalculator, FaBell, FaUserCircle, FaChartLine, FaMapMarkedAlt, FaEye, FaHeart, FaRupeeSign, FaArrowUp, FaHome, FaFilter, FaStar, FaClock, FaLocationArrow } from 'react-icons/fa';
import PropertyCard from '../PropertyCard';
import { useSelector } from 'react-redux';
import '../../styles/DashboardOverview.css';

const DashboardOverview = () => {
  const favorites = useSelector((state) => state.favorites.favorites);
  const allProperties = useSelector((state) => state.properties.listings);
  const compareList = useSelector((state) => state.comparison.compareList);

  const user = { uid: 'mockUserId', displayName: 'Guest User', email: 'guest@example.com' }; // Mock user

  // Get a few recent bookmarks for display
  const recentBookmarks = allProperties.filter(property => 
    favorites.some(fav => fav.id === property.id)
  ).slice(0, 3);

  return (
    <div className="dashboard-overview">
      <div className="overview-section welcome-card">
        <FaUserCircle className="welcome-icon" />
        <h3>Hello, {user.displayName || user.email}!</h3>
        <p>Welcome to your personalized NestFindr dashboard. Here's a quick look at your activity and tools.</p>
      </div>

      <div className="overview-section quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/listings" className="action-item">
            <FaMapMarkedAlt />
            <span>Browse Properties</span>
          </Link>
          <Link to="/calculator" className="action-item">
            <FaCalculator />
            <span>Mortgage Calculator</span>
          </Link>
          <Link to="/dashboard/bookmarks" className="action-item">
            <FaBookmark />
            <span>View Bookmarks</span>
          </Link>
          <Link to="/dashboard/compare" className="action-item">
            <FaListUl />
            <span>Compare Properties</span>
          </Link>
          <Link to="/dashboard/reminders" className="action-item">
            <FaBell />
            <span>Set Reminders</span>
          </Link>
          <Link to="/dashboard/preferences" className="action-item">
            <FaChartLine />
            <span>Market Trends</span>
          </Link>
        </div>
      </div>

      <div className="overview-section recent-bookmarks">
        <h3>Your Recent Bookmarks</h3>
        {recentBookmarks.length > 0 ? (
          <div className="bookmarks-grid">
            {recentBookmarks.map(property => (
              <PropertyCard key={property.id} {...property} isDashboardView={true} />
            ))}
          </div>
        ) : (
          <p>You haven't bookmarked any properties yet. <Link to="/listings">Start browsing!</Link></p>
        )}
      </div>

      <div className="overview-section comparison-summary">
        <h3><FaListUl /> Your Comparison List</h3>
        {compareList.length > 0 ? (
          <p>You have {compareList.length} properties in your comparison list. <Link to="/compare">View Comparison</Link></p>
        ) : (
          <p>Your comparison list is empty. <Link to="/listings">Add properties to compare!</Link></p>
        )}
      </div>

      {/* Dashboard Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaEye />
          </div>
          <div className="stat-content">
            <h4>Properties Viewed</h4>
            <span className="stat-number">12</span>
            <span className="stat-label">This month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon favorites">
            <FaHeart />
          </div>
          <div className="stat-content">
            <h4>Saved Properties</h4>
            <span className="stat-number">{favorites.length}</span>
            <span className="stat-label">Total bookmarks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon price">
            <FaRupeeSign />
          </div>
          <div className="stat-content">
            <h4>Avg. Budget Range</h4>
            <span className="stat-number">₹2.5 Cr</span>
            <span className="stat-label">Based on viewed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon trending">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h4>Market Activity</h4>
            <span className="stat-number">+8.2%</span>
            <span className="stat-label">Price growth</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="overview-section recent-activity">
        <h3><FaClock /> Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon view">
              <FaEye />
            </div>
            <div className="activity-content">
              <p><strong>Viewed</strong> Luxury Villa in Miami</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon bookmark">
              <FaBookmark />
            </div>
            <div className="activity-content">
              <p><strong>Bookmarked</strong> Modern Apartment in New York</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon calculate">
              <FaCalculator />
            </div>
            <div className="activity-content">
              <p><strong>Calculated</strong> mortgage for Spacious House</p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon compare">
              <FaListUl />
            </div>
            <div className="activity-content">
              <p><strong>Added to compare</strong> Charming Cottage</p>
              <span className="activity-time">3 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="overview-section market-insights">
        <h3><FaChartLine /> Market Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <FaLocationArrow className="insight-icon" />
              <h4>Popular Areas</h4>
            </div>
            <div className="insight-content">
              <div className="area-item">
                <span className="area-name">Mumbai Central</span>
                <span className="area-growth">+12.5%</span>
              </div>
              <div className="area-item">
                <span className="area-name">Delhi NCR</span>
                <span className="area-growth">+8.3%</span>
              </div>
              <div className="area-item">
                <span className="area-name">Bangalore IT Hub</span>
                <span className="area-growth">+15.2%</span>
              </div>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-header">
              <FaHome className="insight-icon" />
              <h4>Property Types in Demand</h4>
            </div>
            <div className="insight-content">
              <div className="demand-item">
                <span className="demand-type">2-3 BHK Apartments</span>
                <div className="demand-bar">
                  <div className="demand-fill" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="demand-item">
                <span className="demand-type">Villas</span>
                <div className="demand-bar">
                  <div className="demand-fill" style={{width: '70%'}}></div>
                </div>
              </div>
              <div className="demand-item">
                <span className="demand-type">Studio Apartments</span>
                <div className="demand-bar">
                  <div className="demand-fill" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="overview-section quick-tips">
        <h3><FaStar /> Tips for You</h3>
        <div className="tips-list">
          <div className="tip-item">
            <FaCalculator className="tip-icon" />
            <div className="tip-content">
              <h4>Check Your EMI</h4>
              <p>Use our mortgage calculator to plan your budget before viewing properties.</p>
            </div>
          </div>
          <div className="tip-item">
            <FaLocationArrow className="tip-icon" />
            <div className="tip-content">
              <h4>Location Matters</h4>
              <p>Consider proximity to work, schools, and amenities when choosing a property.</p>
            </div>
          </div>
          <div className="tip-item">
            <FaListUl className="tip-icon" />
            <div className="tip-content">
              <h4>Compare Wisely</h4>
              <p>Add properties to comparison to make informed decisions between options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;