import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FaBell, FaEnvelope, FaHome, FaUser, FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Preferences = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { addNotification } = useNotification();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    propertyAlerts: true,
    priceDropAlerts: true,
    newListingAlerts: false,
    weeklyDigest: true,
    darkMode: false,
    language: 'en',
    currency: 'USD',
    measurementUnit: 'sqft'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user preferences from userProfile
    if (userProfile && userProfile.preferences) {
      setPreferences(prev => ({ ...prev, ...userProfile.preferences }));
    }
  }, [userProfile]);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile({ preferences });
      addNotification('success', 'Preferences saved successfully!');
    } catch (error) {
      addNotification('error', 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      className={`preference-toggle ${enabled ? 'enabled' : ''}`}
      onClick={onToggle}
      type="button"
      aria-pressed={enabled}
    >
      <span className="sr-only">Toggle</span>
    </button>
  );

  return (
    <div className="preferences-container">
      <div className="preferences-header">
        <h2>Preferences & Settings</h2>
        <p>Customize your NestFindr experience</p>
      </div>

      <div className="preferences-sections">
        {/* Notifications Section */}
        <div className="preference-section">
          <div className="section-header">
            <FaBell className="section-icon" />
            <h3>Notifications</h3>
          </div>
          <div className="preference-items">
            <div className="preference-item">
              <div className="preference-info">
                <FaEnvelope className="preference-icon" />
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive updates and alerts via email</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.emailNotifications}
                onToggle={() => handleToggle('emailNotifications')}
              />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <FaBell className="preference-icon" />
                <div>
                  <strong>Push Notifications</strong>
                  <p>Get instant notifications in your browser</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.pushNotifications}
                onToggle={() => handleToggle('pushNotifications')}
              />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <FaHome className="preference-icon" />
                <div>
                  <strong>Property Alerts</strong>
                  <p>Notifications for saved property updates</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.propertyAlerts}
                onToggle={() => handleToggle('propertyAlerts')}
              />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <FaHome className="preference-icon" />
                <div>
                  <strong>Price Drop Alerts</strong>
                  <p>Get notified when property prices drop</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.priceDropAlerts}
                onToggle={() => handleToggle('priceDropAlerts')}
              />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <FaHome className="preference-icon" />
                <div>
                  <strong>New Listing Alerts</strong>
                  <p>Be first to know about new properties</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.newListingAlerts}
                onToggle={() => handleToggle('newListingAlerts')}
              />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <FaEnvelope className="preference-icon" />
                <div>
                  <strong>Weekly Digest</strong>
                  <p>Summary of new properties and market trends</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.weeklyDigest}
                onToggle={() => handleToggle('weeklyDigest')}
              />
            </div>
          </div>
        </div>

        {/* Display & Language Section */}
        <div className="preference-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>Display & Language</h3>
          </div>
          <div className="preference-items">
            <div className="preference-item">
              <div className="preference-info">
                <div>
                  <strong>Language</strong>
                  <p>Choose your preferred language</p>
                </div>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                className="preference-select"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <div>
                  <strong>Currency</strong>
                  <p>Display prices in your preferred currency</p>
                </div>
              </div>
              <select
                value={preferences.currency}
                onChange={(e) => handleSelectChange('currency', e.target.value)}
                className="preference-select"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <div>
                  <strong>Measurement Unit</strong>
                  <p>Choose how areas are displayed</p>
                </div>
              </div>
              <select
                value={preferences.measurementUnit}
                onChange={(e) => handleSelectChange('measurementUnit', e.target.value)}
                className="preference-select"
              >
                <option value="sqft">Square Feet</option>
                <option value="sqm">Square Meters</option>
              </select>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <div>
                  <strong>Dark Mode</strong>
                  <p>Switch to dark theme</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.darkMode}
                onToggle={() => handleToggle('darkMode')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="preferences-actions">
        <button
          className="dashboard-btn save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          <FaSave className="btn-icon" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default Preferences;
