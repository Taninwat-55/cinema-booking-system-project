import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="profile-page-container">
      <Navbar />
      <div className="profile-card">
        <h2>Welcome, {user?.name || 'User'}!</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

        <button onClick={() => navigate('/')} className="home-btn">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
