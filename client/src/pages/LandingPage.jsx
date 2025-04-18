import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import HeroMovies from '../components/HeroMovies';
import { SearchContext } from '../context/SearchContext';
import '../styles/LandingPage.css';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, searchResults, hasSearched } = useContext(SearchContext);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then((res) => {
        if (!res.ok) throw new Error('Nätverksfel eller ogiltigt svar');
        return res.json();
      })
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Fel vid hämtning av filmer:', error.message);
      });
  }, []);

  return (
    <div className="landing-page-container">
      <Navbar />

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <HeroMovies
          movies={hasSearched && searchTerm ? searchResults : movies}
        />
      )}
    </div>
  );
}

export default LandingPage;
