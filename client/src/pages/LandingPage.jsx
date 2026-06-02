import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/Slider';
import HeroMovies from '../components/HeroMovies';
import '../styles/LandingPage.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedGenre) params.append('genre', selectedGenre);
    if (selectedYear) params.append('year', selectedYear);
    if (searchInput) params.append('search', searchInput);

    fetch(`${BASE_URL}/api/movies?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedGenre, selectedYear, searchInput]);

  const nowShowing = movies.filter((m) => !m.release_year || m.release_year < currentYear);
  const comingSoon = movies.filter((m) => m.release_year && m.release_year >= currentYear);

  const uniqueGenres = [
    ...new Set(movies.flatMap((m) => m.genre?.split(', ') || [])),
  ].filter(Boolean);

  const uniqueYears = [...new Set(movies.map((m) => m.release_year))]
    .filter(Boolean)
    .sort((a, b) => b - a);

  const toggleGenre = (genre) => setSelectedGenre((prev) => (prev === genre ? '' : genre));
  const toggleYear = (year) => setSelectedYear((prev) => (prev === String(year) ? '' : String(year)));

  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />

      <section className="movies-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Now Showing</h2>
            <p className="section-subtitle">Curated selections for the discerning viewer.</p>
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">GENRE</span>
            <button
              className={`filter-pill ${selectedGenre === '' ? 'active' : ''}`}
              onClick={() => setSelectedGenre('')}
            >
              All
            </button>
            {uniqueGenres.map((genre) => (
              <button
                key={genre}
                className={`filter-pill ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <span className="filter-label">YEAR</span>
            <button
              className={`filter-pill ${selectedYear === '' ? 'active' : ''}`}
              onClick={() => setSelectedYear('')}
            >
              All
            </button>
            {uniqueYears.map((year) => (
              <button
                key={year}
                className={`filter-pill ${selectedYear === String(year) ? 'active' : ''}`}
                onClick={() => toggleYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <hr className="section-divider" />

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <HeroMovies movies={nowShowing.length ? nowShowing : movies} />
        )}
      </section>

      {!loading && comingSoon.length > 0 && (
        <section className="movies-section coming-soon-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Coming Soon</h2>
              <p className="section-subtitle">Reserve your seat the day tickets drop.</p>
            </div>
          </div>
          <hr className="section-divider" />
          <HeroMovies movies={comingSoon} comingSoon />
        </section>
      )}
    </div>
  );
}

export default LandingPage;
