
import React, { useState, useEffect } from 'react';
import {
  FaEye,
  FaBookmark,
  FaPhone,
  FaHeart,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Stats = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
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
          accountAge: user?.metadata?.creationTime ? 
            Math.floor((Date.now() - new Date(user.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24)) : 0,
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

    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user, showNotification]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <FaChartLine className="mx-auto text-gray-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
            <p className="text-gray-600">Please log in to view your statistics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Statistics</h1>
          <p className="text-gray-600">Track your property search activity and engagement</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={FaEye} 
            number={stats.propertiesViewed} 
            label="Properties Viewed" 
            color="blue"
            trend={12}
          />
          <StatCard 
            icon={FaBookmark} 
            number={stats.bookmarked} 
            label="Bookmarked" 
            color="green"
            trend={8}
          />
          <StatCard 
            icon={FaPhone} 
            number={stats.contacted} 
            label="Agents Contacted" 
            color="purple"
            trend={-3}
          />
          <StatCard 
            icon={FaHeart} 
            number={stats.favorites} 
            label="Favorites" 
            color="red"
            trend={15}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" />
              Activity Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickStat 
                icon={FaSearch} 
                value={stats.searches} 
                label="Total Searches" 
                color="indigo"
              />
              <QuickStat 
                icon={FaMapMarkerAlt} 
                value={stats.citiesSearched} 
                label="Cities Explored" 
                color="green"
              />
              <QuickStat 
                icon={FaClock} 
                value={`${stats.avgResponseTime}h`} 
                label="Avg Response Time" 
                color="orange"
              />
              <QuickStat 
                icon={FaCalendarAlt} 
                value={stats.accountAge} 
                label="Days Active" 
                color="purple"
              />
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Properties Viewed</span>
                <span className="font-semibold text-gray-800">
                  {loading ? (
                    <span className="animate-pulse bg-gray-200 h-4 w-8 rounded inline-block"></span>
                  ) : (
                    stats.monthlyViews
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Interactions</span>
                <span className="font-semibold text-gray-800">
                  {loading ? (
                    <span className="animate-pulse bg-gray-200 h-4 w-8 rounded inline-block"></span>
                  ) : (
                    stats.totalInteractions
                  )}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Activity Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: loading ? '0%' : `${Math.min((stats.totalInteractions / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {loading ? '0' : Math.min(Math.round((stats.totalInteractions / 500) * 100), 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <FaSearch className="text-sm" />
              <span>New Search</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
              <FaBookmark className="text-sm" />
              <span>View Bookmarks</span>
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
              <FaHeart className="text-sm" />
              <span>My Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
