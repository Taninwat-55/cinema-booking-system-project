import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/UpdateUserInfoPage.css';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const UpdateUserInfoPage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/api/users/${user.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      const updatedUser = {
        ...user,
        ...formData,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('User updated!');
      navigate('/profile');
    } else {
      toast.error(data.error || 'Failed to update user');
    }
  };

  return (
    <>
      <Navbar />
      <div className="update-user-form-container">
        <h2>Update Your Info</h2>
        
        <div className="update-user-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="update-user-input"
          />
        </div>
        <div className="updat-user-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="update-user-input"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <button type="submit" className='update-user-button'>Update Info</button>
        </form>
      </div>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
};

export default UpdateUserInfoPage;
