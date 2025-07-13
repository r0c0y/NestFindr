import React, { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ProfileForm from './ProfileForm';
import Stats from './Stats';


const Profile = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.displayName || user.displayName);
          setDob(data.dob || '');
          setAddress(data.address || '');
          setMobile(data.mobile || '');
          setBio(data.bio || '');
          setProfileImageUrl(data.profileImageUrl || user.photoURL || '');
        } else {
          setName(user.displayName || '');
          setProfileImageUrl(user.photoURL || '');
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalImageUrl = profileImageUrl;
      // 1. Handle Image Upload if a new file is selected
      if (newImageFile) {
        setUploading(true);
        setUploadProgress(0);
        // A. Delete the old image from storage if it exists
        if (profileImageUrl && profileImageUrl.includes('firebasestorage')) {
          const oldImageRef = ref(storage, profileImageUrl);
          await deleteObject(oldImageRef).catch(() => {});
        }
        // B. Upload the new image with progress
        const newImageRef = ref(storage, `profileImages/${user.uid}`);
        const uploadTask = uploadBytesResumable(newImageRef, newImageFile);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(percent);
            },
            (err) => {
              setUploading(false);
              setUploadProgress(0);
              reject(err);
            },
            async () => {
              finalImageUrl = await getDownloadURL(newImageRef);
              setUploading(false);
              setUploadProgress(100);
              resolve();
            }
          );
        });
      }
      const userData = {
        displayName: name,
        email: user.email,
        dob,
        address,
        mobile,
        bio,
        profileImageUrl: finalImageUrl,
        lastUpdated: new Date()
      };
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, userData, { merge: true });
      await updateProfile(user, { displayName: name, photoURL: finalImageUrl });
      setEditing(false);
      setNewImageFile(null);
      setProfileImageUrl(finalImageUrl);
      setLoading(false);
      addNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to save profile. Please try again.'
      });
      setLoading(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addNotification({
        type: 'success',
        message: 'Logged out successfully!'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to logout. Please try again.'
      });
    }
  };

  if (loading) return <p>Loading Profile...</p>;
  const age = dob ? Math.floor((Date.now() - new Date(dob)) / 31557600000) : '';

  return (
    <div className="profile-module">
      {editing ? (
        <ProfileForm 
          name={name} setName={setName}
          dob={dob} setDob={setDob}
          address={address} setAddress={setAddress}
          mobile={mobile} setMobile={setMobile}
          bio={bio} setBio={setBio}
          profileImageUrl={profileImageUrl}
          onImageChange={e => setNewImageFile(e.target.files[0])}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
      ) : (
        <div className="profile-display-grid">
          <div className="profile-info-card">
            <div className="profile-header">
              <span className="dashboard-avatar">
                {profileImageUrl ? <img src={profileImageUrl} alt="avatar" /> : (name[0] || '?').toUpperCase()}
              </span>
              <div className="profile-header-info">
                <h3 className="dashboard-name">{name}</h3>
                <p className="dashboard-email">{user.email}</p>
              </div>
              <button className="dashboard-btn" onClick={() => setEditing(true)}>Edit</button>
            </div>
            <div className="profile-details-grid">
              <p><strong>Age:</strong> {age ? `${age} years` : 'Not set'}</p>
              <p><strong>Mobile:</strong> {mobile || 'Not set'}</p>
              <p><strong>Address:</strong> {address || 'Not set'}</p>
              <p><strong>Bio:</strong> {bio || 'Not set'}</p>
            </div>
          </div>
          <div className="profile-stats-card">
            <div className="dashboard-streak-counter">
              <span role="img" aria-label="fire">🔥</span>
              <p>You've visited <strong>5</strong> days in a row!</p>
            </div>
            <Stats />
          </div>
        </div>
      )}
      <button className="dashboard-logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
