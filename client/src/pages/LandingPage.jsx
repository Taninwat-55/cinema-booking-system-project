import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import HeroMovies from '../components/HeroMovies';
import { SearchContext } from '../context/SearchContext';
import '../styles/LandingPage.css';
import SearchBar from '../components/SearchBar';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const { searchTerm, searchResults, hasSearched } = useContext(SearchContext);

  const uniqueGenres = [
    ...new Set(movies.flatMap((movie) => movie.genre?.split(', ') || [])),
  ].filter(Boolean);

  const uniqueYears = [...new Set(movies.map((movie) => movie.release_year))]
    .filter(Boolean)
    .sort((a, b) => b - a);

  const fetchMovies = () => {
    setLoading(true);

    const queryParams = new URLSearchParams();

    if (searchTerm) queryParams.append('search', searchTerm);
    if (selectedGenre) queryParams.append('genre', selectedGenre);
    if (selectedYear) queryParams.append('year', selectedYear);

    fetch(`http://localhost:3001/api/movies?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching movies');
        return res.json();
      })
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch movies:', err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, [searchTerm, selectedGenre, selectedYear]);

  return (
    <div className="landing-page-container">
      <Navbar />

      <div className="filters-container">
        <SearchBar />
        <select
          className="filter-inputs"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Genre</option>
          {uniqueGenres.map((genre, idx) => (
            <option key={idx} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          className="filter-inputs"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Year</option>
          {uniqueYears.map((year, idx) => (
            <option key={idx} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

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
