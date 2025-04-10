import { Link, useParams } from 'react-router-dom';

export default function BookingConfirmationPage() {
  const { bookingNumber } = useParams();

  return (
    <div>
      <h2>Booking Successful!</h2>
      <p>Your booking number is:</p>
      <h3>{bookingNumber}</h3>

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}
