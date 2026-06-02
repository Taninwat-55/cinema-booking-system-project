import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      const userData = {
        ...data.user,
        token: data.token,
        expiry: new Date().getTime() + 60 * 60 * 1000,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');

      const pendingBooking = localStorage.getItem('pending_booking');
      if (pendingBooking) {
        try {
          const claimRes = await fetch(`${BASE_URL}/api/bookings/claim`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              booking_number: pendingBooking,
              user_id: userData.user_id,
            }),
          });
          const result = await claimRes.json();
          if (claimRes.ok) localStorage.removeItem('pending_booking');
          else console.warn('Booking claim failed:', result.error);
        } catch (err) {
          console.error('Failed to claim booking:', err);
        }
      }

      setTimeout(() => navigate('/'), 1500);
    } else {
      toast.error(data.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <Link to="/" className="login-brand">
            <img src="/Logo-final.png" alt="Logo" className="login-brand-logo" />
          </Link>
          <p className="login-brand-tagline">
            Your next great film experience starts here.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Welcome back. Sign in to continue.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label className="login-label">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>

            <div className="login-field-group">
              <label className="login-label">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{' '}
            <Link to="/register" className="login-register-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
