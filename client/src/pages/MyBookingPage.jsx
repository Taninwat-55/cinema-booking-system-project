import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      const res = await fetch(
        `http://localhost:3001/api/bookings/user/${user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
        console.error('Expected array but got:', data);
      }

      const upcoming = data.filter(
        (booking) => new Date(booking.showing_time) > new Date()
      );

      setBookings(upcoming);

      setLoading(false);
    };

    fetchBookings();
  }, [user, navigate]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.booking_id}>
            <h3>Booking Number: {booking.booking_number}</h3>
            {booking.poster_url && (
              <img
                src={booking.poster_url}
                alt={booking.movie_title}
                style={{
                  width: '150px',
                  borderRadius: '8px',
                  marginTop: '0.5rem',
                }}
              />
            )}
            <p>Movie: {booking.movie_title}</p>
            <p>Time: {new Date(booking.showing_time).toLocaleString()}</p>
            <p>Total Price: {booking.total_price} kr</p>
            <p>
              Seats: {booking.seats ? booking.seats.join(', ') : 'No seats'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookingsPage;
