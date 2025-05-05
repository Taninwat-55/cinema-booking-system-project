import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('');
      toast.success('Registered successfully! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="form-inputs">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="input-field"
          />
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        <div className="login-link-container">
          <p className="register-link-text">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
        <button
          type="button"
          className="home-btn"
          onClick={() => navigate('/')}
        >
          Home
        </button>
        {message && <p className="form-message">{message}</p>}
      </div>

      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </div>
  );
};

export default RegisterPage;
