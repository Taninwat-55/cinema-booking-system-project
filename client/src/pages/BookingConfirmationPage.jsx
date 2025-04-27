import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/BookingPages.css';
import Navbar from '../components/Navbar';

export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/bookings/confirmation/${bookingNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data);

        // 🧠 If booking is a guest booking, store in localStorage
        if (!data.user_id) {
          localStorage.setItem('pending_booking', bookingNumber);
        }
      })
      .catch((error) =>
        console.error('Error fetching booking details:', error)
      );
  }, [bookingNumber]);

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="booking-confirmation-container">
      <Navbar />
      <h1>Booking Successful!</h1>
      <div className="booking-details-wrapper">
        {booking.poster_url ? (
          <img
            src={booking.poster_url}
            alt={booking.movie_title}
            className="booking-poster"
          />
        ) : (
          <p>No Poster Available</p>
        )}

        <div className="booking-info">
          <h2>Your Booking Number:</h2>
          <h2 className="booking-number">{bookingNumber}</h2>

          <h2>{booking.movie_title}</h2>
          <p>Time: {new Date(booking.showing_time).toLocaleString()}</p>
          <p>Seats: {booking.seats?.join(', ') || 'No seats found'}</p>
          <p>Total Price: {booking.total_price} kr</p>

          {/* 🎯 If guest */}
          {!booking.user_id && (
            <div className="register-suggestion">
              <p>
                Want to save this booking and access it later?
                <br />
                <strong>Create an account</strong> and we’ll link it to you.
              </p>
              <Link to="/register">
                <button className="booking-btn">Sign Up Now</button>
              </Link>
            </div>
          )}

          <Link to="/my-bookings">
            <button className="booking-btn">Go to My Bookings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
