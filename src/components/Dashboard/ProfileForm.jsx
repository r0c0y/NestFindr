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
    <div className="dashboard-edit-fields-vertical">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label
          htmlFor="profile-image-upload"
          style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}
          onClick={e => {
            if (uploading) e.preventDefault();
            else fileInputRef.current && fileInputRef.current.click();
          }}
        >
          <span className="dashboard-avatar" style={{ width: 60, height: 60, fontSize: 24 }}>
            {profileImageUrl
              ? <img src={profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              : (name ? name[0].toUpperCase() : '?')}
          </span>
          <input
            ref={fileInputRef}
            id="profile-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onImageChange}
            disabled={uploading}
          />
        </label>
        <span style={{ fontSize: 13, color: '#888' }}>Upload Profile Image</span>
      </div>
      {uploading && (
        <div style={{ width: 120, margin: '8px 0' }}>
          <div style={{
            width: '100%',
            height: 8,
            background: '#eee',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: '#ff7300',
              transition: 'width 0.2s'
            }} />
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
            Uploading: {uploadProgress}%
          </div>
        </div>
      )}
      <input value={name} onChange={e => setName(e.target.value)} className="dashboard-input" placeholder="Name" />
      <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="dashboard-input" placeholder="DOB" />
      <input value={address} onChange={e => setAddress(e.target.value)} className="dashboard-input" placeholder="Address" />
      <input value={mobile} onChange={e => setMobile(e.target.value)} className="dashboard-input" placeholder="Mobile Number" />
      <textarea
        value={bio}
        onChange={e => setBio(e.target.value)}
        className="dashboard-input"
        placeholder="Describe yourself, your persona and ideas"
        rows={3}
        style={{ resize: 'vertical' }}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="dashboard-btn" onClick={onSave} disabled={uploading}>Save</button>
        <button className="dashboard-btn dashboard-btn-cancel" onClick={onCancel} disabled={uploading}>Cancel</button>
      </div>
      {saveError && <div className="dashboard-error">{saveError}</div>}
      {saveSuccess && <div className="dashboard-success dashboard-success-fade">{saveSuccess}</div>}
    </div>
  );
};

export default ProfileForm;
