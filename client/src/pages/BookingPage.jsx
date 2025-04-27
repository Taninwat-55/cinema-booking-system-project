import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import Navbar from '../components/Navbar';
import '../styles/SalonBookingPage.css';

function BookingPage() {
  const { id } = useParams();
  const [showing, setShowing] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movie, setMovie] = useState(null);
  const [tickets, setTickets] = useState({
    adult: 1,
    child: 0,
    senior: 0,
  });
  const [isOutdated, setIsOutdated] = useState(false);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const totalTickets = tickets.adult + tickets.child + tickets.senior;

  const getSeatLabel = (row, seat) => {
    const rowLetter = String.fromCharCode(64 + row); // 1 → A, 2 → B, etc.
    return `${rowLetter}${seat}`;
  };

  useEffect(() => {
    fetch(`http://localhost:3001/api/showings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch showing');
        return res.json();
      })
      .then((data) => {
        setShowing(data);
        const showingDate = new Date(data.showing_time);
        const currentDate = new Date();
        if (showingDate < currentDate) {
          setIsOutdated(true);
        }
        return fetch(`http://localhost:3001/api/movies/${data.movie_id}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movie');
        return res.json();
      })
      .then((movieData) => setMovie(movieData))
      .catch((error) => console.error(error));

    fetch(`http://localhost:3001/api/seats/${id}`)
      .then((res) => res.json())
      .then((data) => setSeats(data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedTickets = { ...tickets, [name]: parseInt(value) };
    const totalTickets =
      updatedTickets.adult + updatedTickets.child + updatedTickets.senior;

    console.log('Total tickets allowed:', totalTickets);
    console.log('Selected seats:', selectedSeats);

    if (selectedSeats.length > totalTickets) {
      alert('Selected seats exceed total tickets. Seats will be cleared.');
      setSelectedSeats([]);
    }

    setTickets(updatedTickets);
  };

  const handleSelect = (seat) => {
    const seatLabel = getSeatLabel(seat.row_number, seat.seat_number);

    if (
      !selectedSeats.find((s) => s.id === seat.seat_id) &&
      selectedSeats.length + 1 > totalTickets
    ) {
      alert('You cannot select more seats than tickets!');
      return;
    }

    if (selectedSeats.find((s) => s.id === seat.seat_id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.seat_id));
    } else {
      setSelectedSeats([
        ...selectedSeats,
        { id: seat.seat_id, label: seatLabel },
      ]);
    }
  };

  const handleBooking = async () => {
    if (!selectedSeats.length) {
      alert('Please select at least one seat!');
      return;
    }

    if (selectedSeats.length < totalTickets) {
      alert('You must select seats equal to the number of tickets!');
      return;
    }

    const ticketDetails = [
      { ticket_type: 'vuxen', quantity: tickets.adult, price_per_ticket: 120 },
      { ticket_type: 'barn', quantity: tickets.child, price_per_ticket: 80 },
      {
        ticket_type: 'pensionär',
        quantity: tickets.senior,
        price_per_ticket: 100,
      },
    ].filter((ticket) => ticket.quantity > 0);

    const res = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showing_id: id,
        total_price: totalPrice,
        selected_seats: selectedSeats.map((s) => s.id),
        user_id: user ? user.user_id : null,
        ticket_details: ticketDetails,
      }),
    });

    const data = await res.json();

    navigate(`/booking-confirmation/${data.booking_number}`);
  };

  const totalPrice =
    tickets.adult * 120 + tickets.child * 80 + tickets.senior * 100;

  if (!showing) return <p>Loading showing details...</p>;
  return (
    <div>
      <Navbar />
      {!showing ? (
        <p>Loading showing details...</p>
      ) : (
        <div className="booking-grid-wrapper">
          <div className="left-side">
            <div className="left-content">
              <div className="booking-details-wrapper" key={showing.showing_id}>
                {movie?.poster_url && (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="showing-poster"
                  />
                )}
              </div>
              <h3>{showing.title || 'Title not available'}</h3>
              <p>
                Theater {showing.theater_id || 'N/A'} |{' '}
                {movie?.length_minutes ? `${movie.length_minutes} min` : 'N/A'}
              </p>
              <p>
                Time:{' '}
                {showing.showing_time ? (
                  <>
                    {new Date(showing.showing_time).toLocaleDateString()} |{' '}
                    {new Date(showing.showing_time).toLocaleTimeString()}
                  </>
                ) : (
                  'N/A'
                )}
              </p>
            </div>
          </div>
          <div className="right-side">
            {isOutdated ? (
              <div className="outdated-message">
                <p>This showing is outdated and cannot be booked.</p>
              </div>
            ) : (
              <>
                <div className="tickets">
                  <h2>Tickets</h2>
                  <label>
                    Adults (120 kr):
                    <input
                      type="number"
                      name="adult"
                      min="0"
                      value={tickets.adult}
                      onChange={handleChange}
                    />
                  </label>
                  <br />
                  <label>
                    Children (80 kr):
                    <input
                      type="number"
                      name="child"
                      min="0"
                      value={tickets.child}
                      onChange={handleChange}
                    />
                  </label>
                  <br />
                  <label>
                    Seniors (100 kr):
                    <input
                      type="number"
                      name="senior"
                      min="0"
                      value={tickets.senior}
                      onChange={handleChange}
                    />
                  </label>
                  <h3 className="total-price">Total Price: {totalPrice} kr</h3>
                  <button onClick={handleBooking}>Confirm Booking</button>
                </div>

                <div className="seats-section">
                  <div style={{ perspective: '1000px' }}>
                    <div className="screen">SCREEN</div>
                  </div>
                  <div className="seat-container">
                    {[...new Set(seats.map((seat) => seat.row_number))]
                      .sort((a, b) => a - b)
                      .map((row) => (
                        <div key={row} className="row">
                          {seats
                            .filter((seat) => seat.row_number === row)
                            .sort((a, b) => a.seat_number - b.seat_number)
                            .map((seat) => (
                              <button
                                key={seat.seat_id}
                                onClick={() => handleSelect(seat)}
                                className={`seat ${
                                  selectedSeats.find((s) => s.id === seat.seat_id)
                                    ? 'selected'
                                    : seat.is_available
                                    ? ''
                                    : 'occupied'
                                }`}
                                disabled={!seat.is_available}
                              >
                                {getSeatLabel(seat.row_number, seat.seat_number)}
                              </button>
                            ))}
                        </div>
                      ))}
                  </div>
                  <ul className="showcase">
                    <li>
                      <div className="seat"></div>
                      <small>Available</small>
                    </li>
                    <li>
                      <div className="seat selected"></div>
                      <small>Selected</small>
                    </li>
                    <li>
                      <div className="seat occupied"></div>
                      <small>Taken</small>
                    </li>
                  </ul>
                  <div>
                    <h3>Selected Seats:</h3>
                    <p className="selected-seats-text">
                      {selectedSeats.length > 0
                        ? selectedSeats
                            .map((s) => s.label)
                            .slice()
                            .sort((a, b) => a.localeCompare(b))
                            .join(', ')
                        : 'No seats selected'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
