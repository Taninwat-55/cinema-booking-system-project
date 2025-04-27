import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ShowtimesOverviewPage.css';

function ShowtimesOverviewPage() {
  const [showings, setShowings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchShowings = async () => {
    const query = selectedDate ? `?date=${selectedDate}` : '';
    try {
      const res = await fetch(`http://localhost:3001/api/showings${query}`);
      const data = await res.json();
      setShowings(data);
    } catch (err) {
      console.error('Failed to fetch showings:', err);
    }
  };

  useEffect(() => {
    fetchShowings();
  }, [selectedDate]);

  return (
    <div className="showtimes-page">
      <Navbar />
      <h1 className="showtimes-title">All Upcoming Showings</h1>

      <div className="date-filter-wrapper">
        <label htmlFor="filter-date">Filter by Date:</label>
        <input
          type="date"
          id="filter-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <button onClick={() => setSelectedDate('')}>Clear</button>
        )}
      </div>

      {showings.length === 0 ? (
        <p className="no-showings">No showings available.</p>
      ) : (
        <ul className="showings-grid">
          {showings.map((showing) => (
            <li key={showing.showing_id} className="showing-card">
              <img
                src={showing.poster_url}
                alt={showing.title}
                className="showing-poster"
              />
              <div className="showing-info">
                <h3>{showing.title}</h3>
                <p>
                  {new Date(showing.showing_time).toLocaleDateString()} |{' '}
                  {new Date(showing.showing_time).toLocaleTimeString()}
                </p>
                <p>Theater {showing.theater_id}</p>
                <Link to={`/book/${showing.showing_id}`} className="book-link">
                  Book Ticket
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowtimesOverviewPage;
