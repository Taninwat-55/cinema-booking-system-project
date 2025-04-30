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
    <>
      <Navbar />
    <div className="showtimes-overview-page">
      <h1 className="showtimes-overview-title">All Upcoming Showings</h1>

      <div className="showtimes-filter-section">
        <label htmlFor="filter-date" className="filter-label">Filter by Date:</label>
        <input
          type="date"
          id="filter-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-date-input"
        />
        {selectedDate && (
          <button onClick={() => setSelectedDate('')} className="clear-filter-button">
            Clear
          </button>
        )}
      </div>

      {showings.length === 0 ? (
        <p className="showtimes-empty-message">No showings available.</p>
      ) : (
        <ul className="showtimes-list">
          {showings.map((showing) => (
            <li key={showing.showing_id} className="showtimes-card">
              <img
                src={showing.poster_url}
                alt={showing.title}
                className="showtimes-card-poster"
              />
              <div className="showtimes-card-info">
                <h3 className="showtimes-card-title">{showing.title}</h3>
                <p className="showtimes-card-datetime">
                  {new Date(showing.showing_time).toLocaleDateString()} |{' '}
                  {new Date(showing.showing_time).toLocaleTimeString()}
                </p>
                <p className="showtimes-card-theater">Theater {showing.theater_id}</p>
                <Link to={`/book/${showing.showing_id}`} className="showtimes-card-book-link">
                  Book Ticket
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="circle-one"></div>
    <div className="circle-two"></div>
    </>
  );
}

export default ShowtimesOverviewPage;
