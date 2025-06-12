import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import PropertyCard from '../components/PropertyCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [bookmarkedProps, setBookmarkedProps] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  // const [init, setInit] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      // Profile
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.displayName || user.displayName || '');
        setDob(userData.dob || '');
        setAddress(userData.address || '');
      } else {
        setName(user.displayName || '');
      }
      // Bookmarks
      const bookmarksCollectionRef = collection(db, `users/${user.uid}/bookmarkedProperties`);
      const bookmarkSnapshot = await getDocs(bookmarksCollectionRef);
      const bookmarkIds = bookmarkSnapshot.docs.map(d => d.id);
      // For demo, use dummyProperties
      const dummyProperties = Array.from({ length: 180 }, (_, i) => ({
        id: String(i + 1),
        image: `https://via.placeholder.com/300x200?text=Property+${i + 1}`,
        title: `Property ${i + 1}`,
        address: `Sector ${i + 1}, City`,
        price: 5000000 + i * 100000,
        date: `2025-05-${(i % 30) + 1 < 10 ? '0' : ''}${(i % 30) + 1}`,
      }));
      setBookmarkedProps(dummyProperties.filter(p => bookmarkIds.includes(p.id)));
    };
    fetchUserData();
  }, [user, editing]);

  // Age logic
  const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : '';
  const minDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 13);
    return d.toISOString().split('T')[0];
  })();

  const handleSave = async () => {
    setSaveError('');
    setSaveSuccess('');
    if (!name) {
      setSaveError('Name is required.');
      return;
    }
    if (!dob) {
      setSaveError('DOB is required.');
      return;
    }
    if (age < 13) {
      setSaveError('You must be at least 13 years old.');
      return;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: name,
        email: user.email,
        dob,
        address,
        lastUpdated: new Date()
      }, { merge: true });
      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
      }
      setEditing(false);
      setSaveSuccess('Profile updated!');
      setTimeout(() => setSaveSuccess(''), 5000);
    } catch (err) {
      setSaveError('Failed to update profile.');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (!user) return <div className="dashboard-not-logged">Please log in to view your dashboard.</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Dashboard</h2>
      <div className="dashboard-profile">
        <span className="dashboard-avatar">
          {user.photoURL
            ? <img src={user.photoURL} alt="avatar" />
            : (name || user.email)[0].toUpperCase()}
        </span>
        <div className="dashboard-info">
          {editing ? (
            <div className="dashboard-edit-fields-vertical">
              <input value={name} onChange={e => setName(e.target.value)} className="dashboard-input" placeholder="Name" />
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="dashboard-input" placeholder="DOB" max={minDob} />
              <input value={address} onChange={e => setAddress(e.target.value)} className="dashboard-input" placeholder="Address" />
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="dashboard-btn" onClick={handleSave}>Save</button>
                <button className="dashboard-btn dashboard-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="dashboard-name">{name || user.displayName || user.email}</div>
              <div className="dashboard-email"><b>Email:</b> {user.email}</div>
              {dob && <div className="dashboard-dob"><b>DOB:</b> {dob} <b>(Age:</b> {age})</div>}
              {address && <div className="dashboard-address"><b>Address:</b> {address}</div>}
              {user.phoneNumber && <div className="dashboard-phone"><b>Phone:</b> {user.phoneNumber}</div>}
              <button className="dashboard-btn" onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
          {saveError && <div className="dashboard-error">{saveError}</div>}
          {saveSuccess && <div className="dashboard-success dashboard-success-fade">{saveSuccess}</div>}
        </div>
      </div>
      <div className="dashboard-section">
        <h3>My Bookmarked Properties</h3>
        {bookmarkedProps.length > 0 ? (
          <div className="dashboard-properties-grid">
            {bookmarkedProps.map(prop => (
              <PropertyCard
                key={prop.id}
                {...prop}
                isBookmarked={true}
                onBookmark={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">You haven't saved any properties yet.</div>
        )}
      </div>
      <button className="dashboard-logout-btn" onClick={() => signOut(auth)}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
