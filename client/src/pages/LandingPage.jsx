import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import HeroMovies from '../components/HeroMovies';
import '../styles/LandingPage.css';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { user } = useContext(UserContext);

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
    <div className="landing-page-contianer">
      <Navbar />

      {loading ? <p>Loading movies...</p> : <HeroMovies movies={movies} />}
    </div>
  );
}

export default LandingPage;
