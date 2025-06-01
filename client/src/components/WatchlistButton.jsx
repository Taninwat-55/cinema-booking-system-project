import React, { useContext } from 'react';
import { CiHeart } from 'react-icons/ci';
import { UserContext } from '../context/UserContext';
import '../styles/component_styles/WatchlistButton.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const WatchlistButton = ({ movieId, isInWatchlist, setWatchlist }) => {
  const { user } = useContext(UserContext);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('You need to sign in to add to Watchlist');
      return;
    }

    const method = isInWatchlist ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`${BASE_URL}/api/watchlist`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id,
          movie_id: movieId,
        }),
      });

      if (res.ok) {
        setWatchlist((prev) =>
          isInWatchlist
            ? prev.filter((id) => id !== movieId)
            : [...prev, movieId]
        );
        window.dispatchEvent(new Event('watchlistUpdated'));
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  return (
    <div className='add-to-list-container' onClick={handleToggle}>
      <button className={`watchlist-button ${isInWatchlist ? 'active' : ''}`}>
        <CiHeart className='heart-icon' />
        <span>Watchlist</span>
      </button>
    </div>
  );
};

export default WatchlistButton;
