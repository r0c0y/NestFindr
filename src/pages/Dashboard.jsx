import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (user && !init) {
      setName(user.displayName || user.email || '');
      setInit(true);
    }
  }, [user, init]);

  const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : '';

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">Error: {error.message}</div>;
  if (!user) return <div className="dashboard-not-logged">Please log in to view your dashboard.</div>;

  const displayName = name || user.displayName || user.email || "User";

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-profile">
        <span className="dashboard-avatar">
          {user.photoURL
            ? <img src={user.photoURL} alt="avatar" />
            : (displayName)[0].toUpperCase()}
        </span>
        <div className="dashboard-info">
          {editing ? (
            <div className="dashboard-edit-fields">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="dashboard-input"
                placeholder="Name"
              />
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="dashboard-input"
                placeholder="DOB"
              />
              <button className="dashboard-btn" onClick={() => setEditing(false)}>Save</button>
            </div>
          ) : (
            <div>
              <div className="dashboard-name">{displayName}</div>
              {dob && <div className="dashboard-dob">DOB: {dob} (Age: {age})</div>}
              <button className="dashboard-btn" onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      </div>
      <div className="dashboard-section">
        <h3>My Bookmarked Properties</h3>
        {/* TODO: List bookmarked properties here */}
        <div className="dashboard-empty">No bookmarks yet.</div>
      </div>
      <button className="dashboard-logout-btn" onClick={() => signOut(auth)}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
