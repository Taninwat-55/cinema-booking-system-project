import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddShowingPage = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [showing, setShowing] = useState({
    movie_id: '',
    theater_id: 1,
    showing_time: '',
    price_adult: 120,
    price_child: 80,
    price_senior: 100,
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const handleChange = (e) => {
    setShowing({
      ...showing,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(showing.showing_time);
    const now = new Date();

    if (selectedDate < now) {
      alert('Cannot add a showing in the past!');
      return;
    }

    const res = await fetch('http://localhost:3001/api/admin/showings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(showing),
    });

    if (res.ok) {
      alert('Showing added successfully!');
      navigate('/admin/dashboard');
    } else {
      alert('Failed to add showing');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Showing</h1>
      <form onSubmit={handleSubmit}>
        <select
          name="movie_id"
          value={showing.movie_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie.movie_id} value={movie.movie_id}>
              {movie.title}
            </option>
          ))}
        </select>
        <br />
        <select
          name="theater_id"
          value={showing.theater_id}
          onChange={handleChange}
          required
        >
          <option value={1}>Theater 1</option>
          <option value={2}>Theater 2</option>
        </select>
        <br />
        <input
          type="datetime-local"
          name="showing_time"
          value={showing.showing_time}
          onChange={handleChange}
          required
        />
        <br />
        <label>Adult Price: </label>
        <input
          type="number"
          name="price_adult"
          placeholder="Adult Price"
          value={showing.price_adult}
          onChange={handleChange}
          required
        />
        <br />
        <label>Child Price: </label>
        <input
          type="number"
          name="price_child"
          placeholder="Child Price"
          value={showing.price_child}
          onChange={handleChange}
          required
        />
        <br />
        <label>Senior Price: </label>
        <input
          type="number"
          name="price_senior"
          placeholder="Senior Price"
          value={showing.price_senior}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Add Showing</button>
      </form>
    </div>
  );
};

export default AdminAddShowingPage;
