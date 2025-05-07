import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import '../../styles/admin_styles/AdminManageShowingPage.css';

const AdminManageShowingsPage = () => {
  const [showings, setShowings] = useState([]);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/showings')
      .then((res) => res.json())
      .then((data) => setShowings(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const genres = [
    ...new Set(
      movies
        .filter((movie) => movie?.genre)
        .flatMap((movie) => movie.genre.split(', '))
    ),
  ];

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this showing?'
    );
    if (!confirm) return;

    const res = await fetch(`http://localhost:3001/api/admin/showings/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('Showing deleted!');
      setShowings(showings.filter((s) => s.showing_id !== id));
    } else {
      toast.error('Failed to delete showing');
    }
  };

  return (
    <>
      <Navbar />

      {/* Main container */}
      <div className="admin-manage-showings-container">
        <div
          className="admin-search-filter-controls"
          style={{ marginTop: '10rem' }}
        >
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            id="genre-select-admin-movies"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre, idx) => (
              <option key={idx} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <h1>Manage Showings</h1>
        <ul className="showings-list">
          {showings
            .filter((showing) => {
              const movie = movies.find((m) => m.movie_id === showing.movie_id);
              const matchesTitle = movie?.title
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
              const matchesGenre = selectedGenre
                ? movie?.genre?.includes(selectedGenre)
                : true;
              return matchesTitle && matchesGenre;
            })
            .map((showing) => {
              const movie = movies.find((m) => m.movie_id === showing.movie_id);
              return (
                <li key={showing.showing_id} className="showing-item">
                  <div className="showing-info">
                    <img
                      src={movie?.poster_url}
                      alt={movie?.title}
                      className="showing-poster"
                    />
                    <div>
                      <div>{movie?.title}</div>
                      <div>
                        {new Date(showing.showing_time).toLocaleString()}
                      </div>
                      <div>Theater {showing.theater_id}</div>
                    </div>
                  </div>
                  <div className="button-group">
                    <button
                      className="admin-button edit-button"
                      onClick={() =>
                        navigate(`/admin/edit-showing/${showing.showing_id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="admin-button delete-button"
                      onClick={() => handleDelete(showing.showing_id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="circle-one"></div>
      <div className="circle-two"></div>
    </>
  );
};
export default AdminManageShowingsPage;
