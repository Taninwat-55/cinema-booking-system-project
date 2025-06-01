import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const LoginPage = () => {
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
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
      setMessage('');

      // Claim guest booking if exists
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
          if (claimRes.ok) {
            console.log(result.message || 'Booking claimed');
            localStorage.removeItem('pending_booking');
          } else {
            console.warn('Booking claim failed:', result.error);
          }
        } catch (err) {
          console.error('Failed to claim booking:', err);
        }
      }

      setTimeout(() => {
        navigate('/');
      }, 1500);
    }

    if (!res.ok) {
      toast.error(data.error || 'Login failed. Please try again.');
      return;
    }
  };

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className='login-inputs'>
          <input
            name='email'
            placeholder='Email'
            onChange={handleChange}
            className='login-field'
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            onChange={handleChange}
            className='login-field'
          />
          <button type='submit' className='login-btn'>
            Login
          </button>
        </form>
        <div className='login-link'>
          <p className='register-link'>
            Don't have an account? <Link to='/register'>Register</Link>
          </p>
        </div>
        <button
          type='button'
          className='Home-btn'
          onClick={() => navigate('/')}
        >
          Home
        </button>

        {message && <p className='login-message'>{message}</p>}
      </div>

      <div className='circle-one'></div>
      <div className='circle-two'></div>
    </div>
  );
};

export default LoginPage;
