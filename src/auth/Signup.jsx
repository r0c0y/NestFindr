import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import '../styles/Auth.css';

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    age: '',
    referral: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) return setError('Invalid email');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (!form.fullName || !form.address || !form.age) return setError('All fields required');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await sendEmailVerification(userCred.user);
      setSuccess('Signup successful! Please verify your email.');
      // Optionally save extra info to Firestore here
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
        <select
          name="referral"
          value={form.referral}
          onChange={handleChange}
          required
          className="auth-select"
        >
          <option value="">How did you hear about us?</option>
          <option value="University">University</option>
          <option value="Friend">Friend</option>
          <option value="Colleague">Colleague</option>
          <option value="Social Media">Social Media</option>
          <option value="Other">Other</option>
        </select>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        <button type="submit" className="auth-btn">Sign Up</button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </form>
      <div className="auth-link">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Signup;
