import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/bookingConfirmation.css";
export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/bookings/confirmation/${bookingNumber}`)
      .then((res) => res.json())
      .then((data) => setBooking(data))
      .catch((error) =>
        console.error("Error fetching booking details:", error)
      );
  }, [bookingNumber]);

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="booking-confirmation-container">
      <h1>Booking Successful!</h1>
      <div className="booking-details-wrapper">
        {booking.poster_url ? (
          <img src={booking.poster_url} alt={booking.movie_title} />
        ) : (
          <p>No Poster Available</p>
        )}

        <div className="booking-info">
          <h2>Your booking number is:</h2>
          <h2 className="booking-number">{bookingNumber}</h2>

          <h2>{booking.movie_title}</h2>
          <p>Time: {new Date(booking.showing_time).toLocaleString()}</p>
          <p>Seats: {booking.seats?.join(", ") || "No seats found"}</p>
          <p>Total Price: {booking.total_price} kr</p>

          <Link to="/my-bookings">
            <button className="booking-btn">Go to My Bookings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
