import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Watchlist API response:', data);

          if (data.error) {
            console.log('Invalid token - forcing logout');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login'); // redirect
            return;
          }

          setWatchlist(data);
        });
    }
  }, [user, navigate, setWatchlist]);

  if (!user) return <p>You need to log in to see your watchlist.</p>;

  return (
    <div>
      <h1>My Watchlist</h1>

      {!Array.isArray(watchlist) ? (
        <p>Loading or something went wrong...</p>
      ) : watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul>
          {watchlist.map((movie) => (
            <li key={movie.movie_id}>
              <Link to={`/movies/${movie.movie_id}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WatchlistPage;
