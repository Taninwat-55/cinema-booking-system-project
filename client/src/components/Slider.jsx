import { useEffect, useState } from 'react';
import '../styles/component_styles/Slider.css';

export default function Slider() {
  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching movies');
        return res.json();
      })
      .then((data) => setMovies(data.slice(0, 5))) // only take top 5
      .catch((err) => console.error('❌ Slider fetch failed:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex + 1 >= movies.length ? 0 : prevIndex + 1
      );
    }, 3000); // auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies.length) return null;

  return (
    <div className="slider-container">
      <div className="options">
        {movies.map((movie, index) => (
          <div
            key={movie._id || index}
            className={`option ${index === activeIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${movie.poster_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => setActiveIndex(index)}
          >
            <div className="shadow"></div>
            <div className="label">
              {/* <div className="icon">
                <i className="fas fa-film"></i>
              </div> */}
              <div className="info">
                <div className="main">{movie.title}</div>
                <div className="sub">{movie.release_year}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
