import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/api/auth/register`, {
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
      setMessage('');
      toast.success('Registered and logged in successfully!');

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

      setTimeout(() => navigate('/'), 1500);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className='form-inputs'>
          <input
            name='name'
            placeholder='Name'
            onChange={handleChange}
            className='input-field'
          />
          <input
            name='email'
            placeholder='Email'
            onChange={handleChange}
            className='input-field'
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            onChange={handleChange}
            className='input-field'
          />
          <button type='submit' className='submit-btn'>
            Register
          </button>
        </form>

        <div className='login-link-container'>
          <p className='register-link-text'>
            Already have an account? <Link to='/login'>Log In</Link>
          </p>
        </div>
        <button
          type='button'
          className='home-btn'
          onClick={() => navigate('/')}
        >
          Home
        </button>
        {message && <p className='form-message'>{message}</p>}
      </div>

      <div className='circle-one'></div>
      <div className='circle-two'></div>
    </div>
  );
};

export default RegisterPage;
