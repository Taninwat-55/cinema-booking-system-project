import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import '../../styles/AdminEditMoviePage.css';

const AdminEditMoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: '',
    description: '',
    poster_url: '',
    trailer_url: '',
  });

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3001/api/admin/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });

    if (res.ok) {
      toast.success('Movie updated successfully!');
      navigate('/admin/manage-movies');
    } else {
      toast.error('Failed to update movie');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="edit-movie-container">
        <h1 className="edit-movie-title">Edit Movie</h1>

        <form className="edit-movie-form" onSubmit={handleSubmit}>
          <div className="edit-movie-form-group">
            <label htmlFor="title" className="edit-movie-label">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={movie.title}
              onChange={handleChange}
              className="edit-movie-input"
              required
            />
          </div>

          <div className="edit-movie-form-group">
            <label htmlFor="description" className="edit-movie-label">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={movie.description}
              onChange={handleChange}
              className="edit-movie-input"
              id='description'
              required
            />
          </div>

          <div className="edit-movie-form-group">
            <label htmlFor="poster_url" className="edit-movie-label">
              Poster URL
            </label>
            <input
              type="text"
              name="poster_url"
              placeholder="Enter poster URL"
              value={movie.poster_url}
              onChange={handleChange}
              className="edit-movie-input"
              required
            />
          </div>

          <div className="edit-movie-form-group">
            <label htmlFor="trailer_url" className="edit-movie-label">
              Trailer URL
            </label>
            <input
              type="text"
              name="trailer_url"
              placeholder="Enter trailer URL"
              value={movie.trailer_url}
              onChange={handleChange}
              className="edit-movie-input"
            />
          </div>

          <button type="submit" className="edit-movie-button">
            Update Movie
          </button>
        </form>
      </div>
      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </div>
  );
};

export default AdminEditMoviePage;
