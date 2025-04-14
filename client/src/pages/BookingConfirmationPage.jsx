import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3001/api/bookings/confirmation/${bookingNumber}`)
      .then((res) => res.json())
      .then((data) => setBooking(data))
      .catch((error) =>
        console.error('Error fetching booking details:', error)
      );
  }, [bookingNumber]);

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div>
      <h2>Booking Successful!</h2>
      {booking.poster_url ? (
        <img src={booking.poster_url} alt={booking.movie_title} />
      ) : (
        <p>No Poster Available</p>
      )}
      <p>Your booking number is:</p>
      <h3>{bookingNumber}</h3>

      <h3>Movie: {booking.movie_title}</h3>
      <p>Time: {new Date(booking.showing_time).toLocaleString()}</p>
      <p>Seats: {booking.seats?.join(', ') || 'No seats found'}</p>
      <p>Total Price: {booking.total_price} kr</p>

      <Link to="/my-bookings">
        <button>Go to My Bookings</button>
      </Link>
    </div>
  );
}
