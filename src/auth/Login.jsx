import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import '../styles/Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const navigate = useNavigate();
  const { login, signInWithGoogle, signInWithGithub } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setShowVerify(false);
    try {
      const user = await login(form.email, form.password);
      if (!user.emailVerified) {
        setShowVerify(true);
        setSubmitting(false);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error("Google login error:", err);
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    try {
      await signInWithGithub();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error("GitHub login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="auth-btn" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="auth-error">{error}</div>}
        {showVerify && (
          <div className="auth-error" style={{ background: '#fffbe6', color: '#b26a00' }}>
            Please verify your email before logging in.
          </div>
        )}
      </form>
      <div className="auth-social-login">
        <button onClick={handleGoogleLogin} className="social-btn google-btn">
          <FaGoogle /> Sign in with Google
        </button>
        <button onClick={handleGithubLogin} className="social-btn github-btn">
          <FaGithub /> Sign in with GitHub
        </button>
      </div>
      <div className="auth-link">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default Login;