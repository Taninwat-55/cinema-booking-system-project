import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/TrackBookingPage.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function TrackBookingPage() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [bookingInfo, setBookingInfo] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(
        `${BASE_URL}/api/bookings/track/${bookingNumber}`
      );
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setBookingInfo(data);
    } catch {
      setError('Booking not found. Please check your booking number.');
    }
  };

  return (
    <>
      <Navbar />
      <div className='track-booking-page'>
        <h2 className='track-page-title'>Track Your Booking</h2>
        <form onSubmit={handleSubmit} className='tracking-page-form'>
          <input
            type='text'
            placeholder='Enter booking number'
            value={bookingNumber}
            onChange={(e) => setBookingNumber(e.target.value)}
            required
            className='track-booking-input'
          />
          <button type='submit' className='track-submit-button'>
            Track
          </button>
        </form>

        {error && (
          <p className='error-message' style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {bookingInfo && (
          <div className='track-booking-info'>
            <h3 className='track-booking-title'>
              Booking for: {bookingInfo.title}
            </h3>
            <img
              className='track-booking-poster'
              src={bookingInfo.poster_url}
              alt={bookingInfo.title}
            />
            <p className='track-booking-time'>
              Showing: {new Date(bookingInfo.showing_time).toLocaleString()}
            </p>
            <p className='track-booking-total'>
              Total: {bookingInfo.total_price} kr
            </p>
            <p className='track-booking-seats'>
              Seats:{' '}
              {bookingInfo.seats
                .map((seat) => `${seat.seat_row}${seat.seat_column}`)
                .join(', ')}
            </p>
          </div>
        )}
      </div>
      <div className='circle-one'></div>
      <div className='circle-two'></div>
    </>
  );
}
