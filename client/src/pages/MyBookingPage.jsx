import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/BookingPages.css";
import Navbar from "../components/Navbar";
const MyBookingsPage = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
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
        console.error("Expected array but got:", data);
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
    <div className="booking-confirmation-container">
      <Navbar />
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div className="booking-details-wrapper" key={booking.booking_id}>
            {booking.poster_url && (
              <img
                src={booking.poster_url}
                alt={booking.movie_title}
                className="booking-poster"
              />
            )}

            <div className="booking-info">
              <h2>Booking Number:</h2>
              <h2 className="booking-number">{booking.booking_number}</h2>

              <h2>{booking.movie_title}</h2>
              <p>Time: {new Date(booking.showing_time).toLocaleString()}</p>
              <p>
                Seats: {booking.seats ? booking.seats.join(", ") : "No seats"}
              </p>
              <p>Total Price: {booking.total_price} kr</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookingsPage;
