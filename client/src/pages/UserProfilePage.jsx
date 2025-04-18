import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/UserProfilePage.css'; 

const UserProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  if (!user) return <p>You need to log in to view this page.</p>;

  return (
    <>
      <Navbar />
      <div className="user-profile-container">
        <div className="profile-card">
          <h2>Welcome, {user.name || 'User'}!</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>User ID:</strong> {user.user_id}
          </p>
          <p>
            <strong>Admin:</strong> {user.is_admin ? 'Yes' : 'No'}
          </p>

          <div className="profile-actions">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <button onClick={() => navigate('/')} className="home-btn">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
