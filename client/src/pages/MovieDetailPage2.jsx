import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { WatchlistContext } from '../context/WatchlistContext';
import '../styles/MovieDetailPage2.css';
import Navbar from '../components/Navbar';
import MovieDetail from '../components/MovieDetails';

function MovieDetailPage2() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showings, setShowings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { user } = useContext(UserContext);
  const { fetchWatchlist } = useContext(WatchlistContext);

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    if (user) {
      fetch(`http://localhost:3001/api/users/${user.user_id}/watchlist`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const found = data.some((m) => m.movie_id === Number(id));
          setIsInWatchlist(found);
        });
    }
  }, [id, user]);

  useEffect(() => {
    const url = selectedDate
      ? `http://localhost:3001/api/showings/movie/${id}?date=${selectedDate}`
      : `http://localhost:3001/api/showings/movie/${id}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setShowings(data));
  }, [id, selectedDate]);

  const getEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      // Case 1: youtu.be short link
      if (hostname === 'youtu.be') {
        const videoId = parsedUrl.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Case 2: youtube.com/watch?v=...
      if (hostname.includes('youtube.com') && parsedUrl.searchParams.has('v')) {
        const videoId = parsedUrl.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Fallback: Return null if not recognized
      return null;
    } catch (err) {
      console.error('Invalid trailer URL:', url, err);
      return null;
    }
  };

  const embedUrl = getEmbedUrl(movie?.trailer_url);

  const handleAddWatchlist = () => {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ user_id: user.user_id, movie_id: Number(id) }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchlist(true);
        fetchWatchlist();
        window.dispatchEvent(new Event('watchlistUpdated'));
      }
    });
  };

  const handleRemoveWatchlist = () => {
    fetch('http://localhost:3001/api/watchlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ user_id: user.user_id, movie_id: Number(id) }),
    }).then((res) => {
      if (res.ok) {
        setIsInWatchlist(false);
        fetchWatchlist();
        window.dispatchEvent(new Event('watchlistUpdated'));
      }
    });
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <>
      <Navbar />

        <MovieDetail
          movie={movie}
          embedUrl={embedUrl}
          isInWatchlist={isInWatchlist}
          user={user}
          handleAddWatchlist={handleAddWatchlist}
          handleRemoveWatchlist={handleRemoveWatchlist}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          showings={showings}
        />

      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
}

export default MovieDetailPage2;
