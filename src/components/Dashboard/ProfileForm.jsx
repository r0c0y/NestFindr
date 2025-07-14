import React, { useRef } from 'react';

const ProfileForm = ({
  name,
  setName,
  dob,
  setDob,
  address,
  setAddress,
  mobile,
  setMobile,
  bio,
  setBio,
  profileImageUrl,
  onImageChange,
  onSave,
  onCancel,
  saveError,
  saveSuccess,
  uploading,
  uploadProgress
}) => {
  const fileInputRef = useRef();

  return (
    <div className="profile-form-container">
      <h3>Edit Profile</h3>
      <div className="profile-image-upload-section">
        <label
          htmlFor="profile-image-upload"
          className="profile-image-upload-label"
          style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}
          onClick={e => {
            if (uploading) e.preventDefault();
            else fileInputRef.current && fileInputRef.current.click();
          }}
        >
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="avatar" className="profile-image-preview" />
          ) : (
            <span className="profile-image-preview dashboard-avatar">
              {(name ? name[0].toUpperCase() : '?')}
            </span>
          )}
          <input
            ref={fileInputRef}
            id="profile-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onImageChange}
            disabled={uploading}
          />
          <span>{profileImageUrl ? 'Change Image' : 'Upload Image'}</span>
        </label>
        {uploading && (
          <div className="upload-progress-bar-container">
            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            <div className="upload-progress-text">Uploading: {uploadProgress}%</div>
          </div>
        )}
      </div>

      <div className="profile-form-group">
        <label>Full Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
      </div>
      <div className="profile-form-group">
        <label>Date of Birth</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} placeholder="DOB" />
      </div>
      <div className="profile-form-group">
        <label>Address</label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
      </div>
      <div className="profile-form-group">
        <label>Mobile Number</label>
        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Mobile Number" />
      </div>
      <div className="profile-form-group">
        <label>Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Describe yourself, your persona and ideas"
          rows={3}
        />
      </div>

      <div className="profile-form-actions">
        <button onClick={onSave} disabled={uploading} className="save-btn">Save</button>
        <button onClick={onCancel} disabled={uploading} className="cancel-btn">Cancel</button>
      </div>
      {saveError && <div className="auth-error">{saveError}</div>}
      {saveSuccess && <div className="auth-success">{saveSuccess}</div>}
    </div>
  );
};

export default ProfileForm;
