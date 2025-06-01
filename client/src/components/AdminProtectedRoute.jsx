import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.is_admin !== 1) {
    return <Navigate to="/" />; 
  }

  return children;
};

export default AdminProtectedRoute;
