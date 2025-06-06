import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../styles/admin_styles/AdminAddMoviePage.css';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const genreOptions = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

const AdminAddMoviePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    trailer_url: '',
    release_year: '',
    length_minutes: '',
    imdb_rating: '',
    genre: '',
    useOmdb: true,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `${BASE_URL}/api/admin/movies`;
    const payload = {
      ...formData,
      trailer_url: formData.trailer_url || null,
      length_minutes: parseInt(formData.length_minutes, 10),
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Movie added successfully!');
      setFormData({
        title: '',
        description: '',
        poster_url: '',
        trailer_url: '',
        release_year: '',
        length_minutes: '',
        imdb_rating: '',
        genre: '',
        useOmdb: true,
      });
      setMessage('');
      navigate('/admin/manage-movies');
    } else if (res.status === 400) {
      setMessage(data.message || 'Movie already exists.');
    } else {
      toast.error(data.error || 'Failed to add movie');
    }
  };

  return (
    <>
      <Navbar />
      <div className='add-movie-page'>
        <h1 className='add-movie-heading'>Add New Movie</h1>
        <form onSubmit={handleSubmit} className='movie-form'>
          <label className='omdb-checkbox'>
            <input
              type='checkbox'
              name='useOmdb'
              checked={formData.useOmdb}
              onChange={handleChange}
            />
            <span className='checkbox-icon'></span>
            Fetch from OMDb
          </label>

          <input
            type='text'
            name='title'
            placeholder='Movie Title'
            value={formData.title}
            onChange={handleChange}
            required
          />

          {!formData.useOmdb && (
            <div className='manual-entry-fields'>
              <textarea
                name='description'
                placeholder='Description'
                value={formData.description}
                onChange={(e) => {
                  handleChange(e);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                required
              />

              <input
                type='text'
                name='poster_url'
                placeholder='Poster URL'
                value={formData.poster_url}
                onChange={handleChange}
                required
              />
              <input
                type='text'
                name='trailer_url'
                placeholder='Trailer URL'
                value={formData.trailer_url}
                onChange={handleChange}
              />
              <input
                type='number'
                name='release_year'
                placeholder='Release Year'
                value={formData.release_year}
                onChange={handleChange}
                required
              />
              <input
                type='number'
                name='length_minutes'
                placeholder='Length (minutes)'
                value={formData.length_minutes}
                onChange={handleChange}
                required
              />
              <input
                type='number'
                step='0.1'
                name='imdb_rating'
                placeholder='IMDb Rating'
                value={formData.imdb_rating}
                onChange={handleChange}
                required
              />
              <select
                name='genre'
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value=''>Select Genre</option>
                {genreOptions.map((g, idx) => (
                  <option key={idx} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button type='submit'>Add Movie</button>
        </form>

        {message && <div className='form-response'>{message}</div>}
      </div>
      <div className='circle-one'></div>
      <div className='circle-two'></div>
    </>
  );
};

export default AdminAddMoviePage;
