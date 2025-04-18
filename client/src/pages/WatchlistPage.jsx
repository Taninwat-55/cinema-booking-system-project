import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/WatchlistPage.css'; 

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
          if (data.error) {
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
            return;
          }
          setWatchlist(data);
        });
    }
  }, [user, navigate, setUser]);

  if (!user)
    return (
      <p className="watchlist-page">
        You need to log in to see your watchlist.
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="watchlist-page">
        {!Array.isArray(watchlist) ? (
          <p>Loading or something went wrong...</p>
        ) : watchlist.length === 0 ? (
          <div className="empty-watchlist">
            <p>Your watchlist is empty.</p>
            <Link to="/" className="back-to-home">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="movie-list">
            {watchlist.map((movie) => (
              <div key={movie.movie_id} className="movie-card">
                <div className="movie-info">
                  <img src={movie.poster_url} alt={movie.title} />

                  <div>
                    <p className="movie-title">{movie.title}</p>
                  </div>

                  <div className="movie-meta">
                    <span className="rating">{movie.rating || 'N/A'}</span>
                    <span className="year">{movie.year}</span>
                    <span className="duration">{movie.duration}</span>
                  </div>

                  <p className="genres-text">
                    {movie.genres?.length
                      ? movie.genres.join(', ')
                      : 'Genre Unknown'}
                  </p>

                  <Link
                    to={`/movies/${movie.movie_id}`}
                    className="watchlist-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
}

export default WatchlistPage;
