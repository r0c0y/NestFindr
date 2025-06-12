import React, { useState } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  // Placeholder for editable info and bookmarks
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [dob, setDob] = useState('');
  const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : '';

  if (!user) return <div style={{ padding: 40 }}>Please log in to view your dashboard.</div>;

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: '#fff8f0', borderRadius: 14, boxShadow: '0 4px 24px rgba(255,115,0,0.10)', padding: 32 }}>
      <h2 style={{ color: '#ff7300', textAlign: 'center', marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <span className="avatar-circle" style={{ width: 60, height: 60, fontSize: 24 }}>
          {user.photoURL
            ? <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            : (user.displayName || user.email)[0].toUpperCase()}
        </span>
        <div>
          {editing ? (
            <>
              <input value={name} onChange={e => setName(e.target.value)} style={{ fontSize: 18, padding: 4, borderRadius: 6, border: '1px solid #ccc' }} />
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ marginLeft: 8, padding: 4, borderRadius: 6, border: '1px solid #ccc' }} />
              <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Save</button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{name || user.displayName || user.email}</div>
              {dob && <div style={{ fontSize: 15, color: '#555' }}>DOB: {dob} (Age: {age})</div>}
              <button onClick={() => setEditing(true)} style={{ marginTop: 4 }}>Edit</button>
            </>
          )}
        </div>
      </div>
      <div style={{ margin: '24px 0', borderTop: '1px solid #eee', paddingTop: 16 }}>
        <h3 style={{ color: '#1976d2', marginBottom: 10 }}>My Bookmarked Properties</h3>
        {/* TODO: List bookmarked properties here */}
        <div style={{ color: '#888' }}>No bookmarks yet.</div>
      </div>
      <button onClick={() => signOut(auth)} style={{ background: '#ff7300', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
