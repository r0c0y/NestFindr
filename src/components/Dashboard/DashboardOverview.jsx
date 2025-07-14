import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBookmark, FaListUl, FaCalculator, FaBell, FaUserCircle, FaChartLine, FaMapMarkedAlt, FaEye, FaHeart, FaRupeeSign, FaArrowUp, FaHome, FaFilter, FaStar, FaClock, FaLocationArrow,
  FaSearch, FaCalendarAlt, FaPhone
} from 'react-icons/fa';
import PropertyCard from '../PropertyCard';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/DashboardOverview.css';

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const favorites = useSelector((state) => state.favorites.favorites);
  const allProperties = useSelector((state) => state.properties.listings);
  const compareList = useSelector((state) => state.comparison.compareList);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    propertiesViewed: 0,
    bookmarked: 0,
    contacted: 0,
    favorites: 0,
    searches: 0,
    accountAge: 0,
    avgResponseTime: 0,
    citiesSearched: 0,
    monthlyViews: 0,
    totalInteractions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data based on user activity
        const mockStats = {
          propertiesViewed: Math.floor(Math.random() * 200) + 50,
          bookmarked: Math.floor(Math.random() * 50) + 10,
          contacted: Math.floor(Math.random() * 30) + 5,
          favorites: Math.floor(Math.random() * 25) + 8,
          searches: Math.floor(Math.random() * 100) + 20,
          accountAge: currentUser?.metadata?.creationTime ? 
            Math.floor((Date.now() - new Date(currentUser.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24)) : 0,
          avgResponseTime: Math.floor(Math.random() * 24) + 2,
          citiesSearched: Math.floor(Math.random() * 10) + 3,
          monthlyViews: Math.floor(Math.random() * 80) + 20,
          totalInteractions: Math.floor(Math.random() * 300) + 100
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        showNotification('Failed to load statistics', 'error');
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [currentUser, showNotification]);

  // Get a few recent bookmarks for display
  const recentBookmarks = allProperties.filter(property => 
    favorites.some(fav => fav.id === property.id)
  ).slice(0, 3);

  const StatCard = ({ icon: Icon, number, label, color = 'blue', trend = null }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {Icon && <Icon className={`text-${color}-600 text-xl`} />}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <FaChartLine className="mr-1" />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-800">
          {loading ? (
            <span className="animate-pulse bg-gray-200 h-6 w-16 rounded inline-block"></span>
          ) : (
            number.toLocaleString()
          )}
        </p>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
      </div>
    </div>
  );

  const QuickStat = ({ icon: Icon, value, label, color = 'gray' }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full bg-${color}-100`}>
        {Icon && <Icon className={`text-${color}-600 text-sm`} />}
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-800">
          {loading ? (
            <span className="animate-pulse bg-gray-200 h-4 w-12 rounded inline-block"></span>
          ) : (
            value
          )}
        </p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-overview">
      <div className="overview-section welcome-card">
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="User Avatar" className="welcome-avatar" />
        ) : (
          <FaUserCircle className="welcome-icon" />
        )}
        <h3>Hello, {currentUser?.displayName || currentUser?.email || 'Guest'}!</h3>
        <p>Welcome to your personalized NestFindr dashboard. Here's a quick look at your activity and tools.</p>
      </div>

      <div className="overview-section quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/listings" className="action-item">
            <FaMapMarkedAlt />
            <span>Browse Properties</span>
            <p className="action-description">Find your next home</p>
          </Link>
          <Link to="/calculator" className="action-item">
            <FaCalculator />
            <span>Mortgage Calculator</span>
            <p className="action-description">Estimate your loan payments</p>
          </Link>
          <Link to="/dashboard/bookmarks" className="action-item">
            <FaBookmark />
            <span>View Bookmarks</span>
            <p className="action-description">Access your saved properties</p>
          </Link>
          <Link to="/dashboard/compare" className="action-item">
            <FaListUl />
            <span>Compare Properties</span>
            <p className="action-description">Side-by-side property comparison</p>
          </Link>
          <Link to="/dashboard/reminders" className="action-item">
            <FaBell />
            <span>Set Reminders</span>
            <p className="action-description">Never miss a payment</p>
          </Link>
          <Link to="/dashboard/preferences" className="action-item">
            <FaChartLine />
            <span>Market Trends</span>
            <p className="action-description">Stay updated on market changes</p>
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

      {/* Recent Activity */}
      <div className="overview-section recent-activity">
        <h3><FaClock /> Recent Activity</h3>
        <div className="activity-list">
          {loading ? (
            <p className="text-center text-gray-500">Loading recent activity...</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Market Insights */}
      <div className="overview-section market-insights">
        <h3><FaChartLine /> Market Insights</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading market insights...</p>
        ) : (
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
        )}
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