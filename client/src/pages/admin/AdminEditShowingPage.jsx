import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Nabar from '../../components/Navbar';
import '../../styles/admin_styles/AdminEditShowingPage.css';

const AdminEditShowingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    movie_id: '',
    theater_id: 1,
    showing_time: '',
    price_adult: 120,
    price_child: 80,
    price_senior: 100,
  });

  useEffect(() => {
    fetch(`http://localhost:3001/api/showings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          movie_id: data.movie_id,
          theater_id: data.theater_id,
          showing_time: data.showing_time.slice(0, 16),
          price_adult: data.price_adult,
          price_child: data.price_child,
          price_senior: data.price_senior,
        });
      });

    fetch('http://localhost:3001/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/api/admin/showings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success('Showing updated!');
      navigate('/admin/manage-showings');
    } else {
      toast.error('Failed to update showing');
    }
  };

  return (
    <>
      <Nabar />
      <div className="admin-edit-showing-container">
        <h1 className="admin-edit-title">Edit Showing</h1>
        {form.movie_id && (
          <div className="admin-edit-info-box">
            <h3>Now Editing Showing ID: {id}</h3>
            <p>
              Movie:{' '}
              <strong>
                {movies.find((m) => m.movie_id === form.movie_id)?.title ||
                  'Loading...'}
              </strong>
            </p>
            <p>
              Date & Time:{' '}
              <strong>{new Date(form.showing_time).toLocaleString()}</strong>
            </p>
          </div>
        )}
        <form className="admin-edit-form" onSubmit={handleSubmit}>
          <div className="admin-edit-form-group">
            <label className="admin-edit-label">Select Movie:</label>
            <select
              name="movie_id"
              value={form.movie_id}
              onChange={handleChange}
              disabled // <-- lock selection
              className="admin-edit-select"
              required
            >
              {!form.movie_id && <option value="">Select Movie</option>}
              {movies.map((movie) => (
                <option key={movie.movie_id} value={movie.movie_id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-edit-form-group">
            <label className="admin-edit-label">Select Theater:</label>
            <select
              className="admin-edit-select"
              name="theater_id"
              value={form.theater_id}
              onChange={handleChange}
              required
            >
              <option value={1}>Theater 1</option>
              <option value={2}>Theater 2</option>
            </select>
          </div>

          <div className="admin-edit-form-group">
            <label className="admin-edit-label">Showing Time:</label>
            <input
              className="admin-edit-input"
              type="datetime-local"
              name="showing_time"
              value={form.showing_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-edit-form-group">
            <label className="admin-edit-label">Adult Price:</label>
            <input
              className="admin-edit-input"
              type="number"
              name="price_adult"
              value={form.price_adult}
              onChange={handleChange}
            />
          </div>

          <div className="admin-edit-form-group">
            <label className="admin-edit-label">Child Price:</label>
            <input
              className="admin-edit-input"
              type="number"
              name="price_child"
              value={form.price_child}
              onChange={handleChange}
            />
          </div>

          <div className="admin-edit-form-group">
            <label className="admin-edit-label">Senior Price:</label>
            <input
              className="admin-edit-input"
              type="number"
              name="price_senior"
              value={form.price_senior}
              onChange={handleChange}
            />
          </div>

          <button className="admin-edit-button" type="submit">
            Update Showing
          </button>
        </form>
      </div>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
};

export default AdminEditShowingPage;
