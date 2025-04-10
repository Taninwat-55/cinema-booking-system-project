import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      const res = await fetch(
        `http://localhost:3001/api/bookings/user/${user.id}`
      );
      const data = await res.json();
      setBookings(data);
    };

    fetchBookings();
  }, [user, navigate]);

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.booking_id}
            style={{
              border: '1px solid #ccc',
              margin: '1rem',
              padding: '1rem',
            }}
          >
            <h3>Booking Number: {booking.booking_number}</h3>
            <p>Movie: {booking.movie_title}</p>
            <p>Time: {booking.start_time}</p>
            <p>Seats: {booking.seats.join(', ')}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookingsPage;
