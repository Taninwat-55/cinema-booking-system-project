import { Link, useParams } from 'react-router-dom';
import "../styles/BookingConfirmation.css";

export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams();

  return (
    <div>
      <h1>Booking Successful!</h1>
      <h2>Your booking number is:</h2>
      <h2 id="booking-number">{bookingNumber}</h2>

      <Link to="/">
        <button className="btn">Back to Home</button>
      </Link>
    </div>
  );
}
