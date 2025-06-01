import { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

export const WatchlistContext = createContext();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const WatchlistProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = async () => {
    if (!user) return setWatchlist([]);

    try {
      const res = await fetch(
        `${BASE_URL}/api/users/${user.user_id}/watchlist`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setWatchlist(data.map((movie) => movie.movie_id));
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  useEffect(() => {
    fetchWatchlist();

    const handleRefresh = () => {
      fetchWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleRefresh);
    return () => {
      window.removeEventListener('watchlistUpdated', handleRefresh);
    };
  }, [user]);

  return (
    <WatchlistContext.Provider value={{ watchlist, fetchWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
