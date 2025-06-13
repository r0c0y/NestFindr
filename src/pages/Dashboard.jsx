import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import PropertyCard from '../components/PropertyCard';
import ProfileForm from '../components/ProfileForm';
import '../styles/Dashboard.css';

const storage = getStorage();

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [bookmarkedProps, setBookmarkedProps] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [removingBookmarkId, setRemovingBookmarkId] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkSavedId, setBookmarkSavedId] = useState(null);

  // Fetch user profile and bookmarks from Firestore
  const fetchUserData = useCallback(async () => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      // 1. Fetch User Profile
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.displayName || user.displayName || '');
        setDob(userData.dob || '');
        setAddress(userData.address || '');
        setMobile(userData.mobile || '');
        setBio(userData.bio || '');
        setProfileImageUrl(userData.profileImageUrl || '');
      } else {
        setName(user.displayName || '');
        setProfileImageUrl(user.photoURL || '');
      }
      // 2. Fetch Bookmarked Property IDs
      const bookmarksCollectionRef = collection(db, `users/${user.uid}/bookmarkedProperties`);
      const bookmarkSnapshot = await getDocs(bookmarksCollectionRef);
      const bookmarkIds = bookmarkSnapshot.docs.map(d => d.id);
      // 3. Fetch full data for each bookmarked property (from Firestore 'properties' collection)
      if (bookmarkIds.length > 0) {
        const propsPromises = bookmarkIds.map(id => getDoc(doc(db, 'properties', id)));
        const propsDocs = await Promise.all(propsPromises);
        const propsData = propsDocs
          .filter(d => d.exists())
          .map(d => ({ id: d.id, ...d.data() }));
        setBookmarkedProps(propsData);
      } else {
        setBookmarkedProps([]);
      }
    } catch (err) {
      setSaveError('Failed to fetch user data.');
      setBookmarkedProps([]);
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, editing]);

  // Age logic
  const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : '';
  const minDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 13);
    return d.toISOString().split('T')[0];
  })();

  // Handle profile image upload (only show in edit mode)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setProfileImageFile(file);
    try {
      // Delete old image if exists
      if (profileImageUrl) {
        try {
          const oldRef = ref(storage, profileImageUrl);
          await deleteObject(oldRef);
        } catch (err) {
          // ignore if not found
        }
      }
      // Upload new image
      const storageRef = ref(storage, `profileImages/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfileImageUrl(url);
      setSaveSuccess('Profile image uploaded!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setSaveError('Failed to upload image.');
    }
  };

  // Remove bookmark from dashboard
  const handleRemoveBookmark = async (propertyId) => {
    if (!user) return;
    setRemovingBookmarkId(propertyId);
    try {
      await deleteDoc(doc(db, `users/${user.uid}/bookmarkedProperties`, propertyId));
      setBookmarkedProps(prev => prev.filter(p => String(p.id) !== String(propertyId)));
    } catch (err) {
      setSaveError('Failed to remove bookmark.');
    }
    setRemovingBookmarkId(null);
  };

  // Add bookmark from dashboard (for demo, in case you want to allow it)
  const handleAddBookmark = async (property) => {
    if (!user) return;
    setBookmarkLoading(true);
    setBookmarkSavedId(null);
    try {
      await setDoc(doc(db, `users/${user.uid}/bookmarkedProperties`, property.id), {
        bookmarkedAt: new Date()
      });
      setBookmarkSavedId(property.id);
      setTimeout(() => setBookmarkSavedId(null), 2000);
      fetchUserData(); // Refresh bookmarks
    } catch (err) {
      setSaveError('Failed to bookmark property.');
    }
    setBookmarkLoading(false);
  };

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
      let photoURL = profileImageUrl;
      // If a new image was uploaded, update Firebase Auth profile too
      if (profileImageFile && user) {
        const storageRef = ref(storage, `profileImages/${user.uid}/${profileImageFile.name}`);
        await uploadBytes(storageRef, profileImageFile);
        photoURL = await getDownloadURL(storageRef);
        setProfileImageUrl(photoURL);
      }
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: name,
        email: user.email,
        dob,
        address,
        mobile,
        bio,
        profileImageUrl: photoURL,
        lastUpdated: new Date()
      }, { merge: true });
      // Update Firebase Auth profile
      if (user.displayName !== name || user.photoURL !== photoURL) {
        await updateProfile(user, { displayName: name, photoURL });
      }
      setEditing(false);
      setSaveSuccess('Profile updated successfully! Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setSaveError('Failed to update profile.');
    }
  };

  if (loading || profileLoading) return <div className="dashboard-loading">Loading...</div>;
  if (!user) return <div className="dashboard-not-logged">Please log in to view your dashboard.</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Dashboard</h2>

      {/* --- PROFILE SECTION --- */}
      <div className="dashboard-section">
        <h3>My Profile</h3>
        <div className="dashboard-profile">
          <span className="dashboard-avatar">
            {profileImageUrl
              ? <img src={profileImageUrl} alt="avatar" />
              : (name || user.email)[0].toUpperCase()}
          </span>
          {editing && (
            <label htmlFor="profile-image-upload" style={{ marginLeft: 16 }}>
              <button
                type="button"
                className="dashboard-btn"
                style={{ padding: '6px 14px', fontSize: 14, marginTop: 6 }}
                onClick={() => document.getElementById('profile-image-upload').click()}
              >
                Upload Profile Image
              </button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </label>
          )}
          <div className="dashboard-info">
            {editing ? (
              <ProfileForm
                name={name}
                setName={setName}
                dob={dob}
                setDob={setDob}
                address={address}
                setAddress={setAddress}
                minDob={minDob}
                mobile={mobile}
                setMobile={setMobile}
                bio={bio}
                setBio={setBio}
                profileImageUrl={profileImageUrl}
                onImageChange={handleImageChange}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
                saveError={saveError}
                saveSuccess={saveSuccess}
              />
            ) : (
              <div>
                <div className="dashboard-name">{name || user.displayName || user.email}</div>
                <div className="dashboard-email"><b>Email:</b> {user.email}</div>
                {dob && <div className="dashboard-dob"><b>DOB:</b> {dob} <b>(Age:</b> {age})</div>}
                {address && <div className="dashboard-address"><b>Address:</b> {address}</div>}
                {mobile && <div className="dashboard-phone"><b>Mobile:</b> {mobile}</div>}
                {bio && <div className="dashboard-bio"><b>Bio:</b> {bio}</div>}
                <button className="dashboard-btn" onClick={() => setEditing(true)}>Edit</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BOOKMARKED PROPERTIES SECTION --- */}
      <div className="dashboard-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0 }}>My Saved Properties</h3>
          <button
            className="dashboard-refresh-btn"
            title="Refresh Bookmarks"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginLeft: 4,
              fontSize: 20,
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={fetchUserData}
            aria-label="Refresh Bookmarks"
          >
            <span role="img" aria-label="refresh">🔄</span>
          </button>
        </div>
        {bookmarkedProps.length > 0 ? (
          <div className="dashboard-properties-grid">
            {bookmarkedProps.map(prop => (
              <PropertyCard
                key={prop.id}
                {...prop}
                isDashboardView={true}
                onRemoveBookmark={() => handleRemoveBookmark(prop.id)}
                bookmarkLoading={removingBookmarkId === String(prop.id) || bookmarkLoading}
                bookmarkRemoved={removingBookmarkId === String(prop.id)}
                onBookmark={() => handleAddBookmark(prop)}
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
