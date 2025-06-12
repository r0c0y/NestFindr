import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Signup = () => {
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    dob: '',
    referral: '',
    referralOther: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError('Invalid email');
      setSubmitting(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setSubmitting(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }
    if (!form.fullName || !form.address || !form.dob) {
      setError('All fields required');
      setSubmitting(false);
      return;
    }
    if (form.referral === '') {
      setError('Please select how you heard about us');
      setSubmitting(false);
      return;
    }
    if (form.referral === 'Other' && !form.referralOther) {
      setError('Please specify your referral source');
      setSubmitting(false);
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await sendEmailVerification(userCred.user);
      setSuccess('Signup successful! Please verify your email. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          className={form.fullName ? 'filled' : ''}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className={form.address ? 'filled' : ''}
        />
        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          required
          className={form.dob ? 'filled' : ''}
        />
        <select
          name="referral"
          value={form.referral}
          onChange={handleChange}
          required
          className={form.referral ? 'filled auth-select' : 'auth-select'}
        >
          <option value="">How did you hear about us?</option>
          <option value="University">University</option>
          <option value="Friend">Friend</option>
          <option value="Colleague">Colleague</option>
          <option value="Social Media">Social Media</option>
          <option value="Other">Other</option>
        </select>
        {form.referral === 'Other' && (
          <input
            name="referralOther"
            placeholder="Please specify"
            value={form.referralOther}
            onChange={handleChange}
            required
            className={form.referralOther ? 'filled' : ''}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={form.email ? 'filled' : ''}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className={form.password ? 'filled' : ''}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className={form.confirmPassword ? 'filled' : ''}
        />
        <button type="submit" className="auth-btn" disabled={submitting}>
          {submitting ? 'Signing Up...' : 'Sign Up'}
        </button>
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
