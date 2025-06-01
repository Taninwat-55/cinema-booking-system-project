import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import '../styles/WatchlistPage.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = () => {
      if (user) {
        fetch(`${BASE_URL}/api/users/${user.user_id}/watchlist`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              localStorage.removeItem('user');
              setUser(null);
              navigate('/login');
              return;
            }
            setWatchlist(data);
          });
      }
    };

    fetchWatchlist();

    const handleWatchlistUpdated = () => {
      fetchWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdated);

    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdated);
    };
  }, [user, navigate, setUser]);

  if (!user) {
    return (
      <p className='watchlist-page'>
        You need to log in to see your watchlist.
      </p>
    );
  }

  const watchlistIds = watchlist.map((movie) => movie.movie_id);

  return (
    <>
      <Navbar />
      <div className='watchlist-page'>
        {!Array.isArray(watchlist) ? (
          <p>Loading or something went wrong...</p>
        ) : watchlist.length === 0 ? (
          <div className='empty-watchlist'>
            <p>Your watchlist is empty.</p>
          </div>
        ) : (
          <div className='movie-list'>
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.movie_id}
                movie={movie}
                watchlist={watchlistIds}
                setWatchlist={() => {}}
                showDetails
                showHeartIcon
              />
            ))}
          </div>
        )}
      </div>
      <div className='circle-one'></div>
      <div className='circle-two'></div>
    </>
  );
}

export default WatchlistPage;
