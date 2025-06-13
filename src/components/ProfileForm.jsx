import React from 'react';

const ProfileForm = ({
  name,
  setName,
  dob,
  setDob,
  address,
  setAddress,
  minDob,
  mobile,
  setMobile,
  bio,
  setBio,
  profileImageUrl,
  onImageChange,
  onSave,
  onCancel,
  saveError,
  saveSuccess
}) => (
  <div className="dashboard-edit-fields-vertical">
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <label htmlFor="profile-image-upload" style={{ cursor: 'pointer' }}>
        <span className="dashboard-avatar" style={{ width: 60, height: 60, fontSize: 24 }}>
          {profileImageUrl
            ? <img src={profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            : (name ? name[0].toUpperCase() : '?')}
        </span>
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onImageChange}
        />
      </label>
      <span style={{ fontSize: 13, color: '#888' }}>Upload Profile Image</span>
    </div>
    <input value={name} onChange={e => setName(e.target.value)} className="dashboard-input" placeholder="Name" />
    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="dashboard-input" placeholder="DOB" max={minDob} />
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
      <button className="dashboard-btn" onClick={onSave}>Save</button>
      <button className="dashboard-btn dashboard-btn-cancel" onClick={onCancel}>Cancel</button>
    </div>
    {saveError && <div className="dashboard-error">{saveError}</div>}
    {saveSuccess && <div className="dashboard-success dashboard-success-fade">{saveSuccess}</div>}
  </div>
);

export default ProfileForm;
