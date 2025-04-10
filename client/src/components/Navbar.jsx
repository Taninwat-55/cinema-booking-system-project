import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <Link to="/my-bookings">My Bookings</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
