import { useState } from 'react';

export default function TrackBookingPage() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [bookingInfo, setBookingInfo] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(
        `http://localhost:3001/api/bookings/track/${bookingNumber}`
      );
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setBookingInfo(data);
    } catch {
      setError('Booking not found. Please check your booking number.');
    }
  };

  return (
    <div>
      <h2>Track Your Booking</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter booking number"
          value={bookingNumber}
          onChange={(e) => setBookingNumber(e.target.value)}
          required
        />
        <button type="submit">Track</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookingInfo && (
        <div>
          <h3>Booking for: {bookingInfo.title}</h3>
          <img src={bookingInfo.poster_url} alt={bookingInfo.title} />
          <p>Showing: {new Date(bookingInfo.showing_time).toLocaleString()}</p>
          <p>Total: {bookingInfo.total_price} kr</p>
          <p>
            Seats:{' '}
            {bookingInfo.seats
              .map((seat) => `${seat.seat_row}${seat.seat_column}`)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
