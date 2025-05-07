import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import ShowingDetails from '../components/ShowingDetails';
import TicketSelector from '../components/TicketSelector';
import SeatSelector from '../components/SeatSelector';
import '../styles/BookingPage.css';

function BookingPage() {
  const { id } = useParams();
  const [showing, setShowing] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({ adult: 1, child: 0, senior: 0 });
  const [isOutdated, setIsOutdated] = useState(false);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const totalTickets = tickets.adult + tickets.child + tickets.senior;
  const totalPrice =
    tickets.adult * 120 + tickets.child * 80 + tickets.senior * 100;

  useEffect(() => {
    fetch(`http://localhost:3001/api/showings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch showing');
        return res.json();
      })
      .then((data) => {
        setShowing(data);
        const showingDate = new Date(data.showing_time);
        if (showingDate < new Date()) setIsOutdated(true);
        return fetch(`http://localhost:3001/api/movies/${data.movie_id}`);
      })
      .then((res) => res.json())
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
    const updatedTotal =
      updatedTickets.adult + updatedTickets.child + updatedTickets.senior;

    if (selectedSeats.length > updatedTotal) {
      alert('Selected seats exceed total tickets. Seats will be cleared.');
      setSelectedSeats([]);
    }

    setTickets(updatedTickets);
  };

  const getSeatLabel = (row, seat) => {
    const rowLetter = String.fromCharCode(64 + row);
    return `${rowLetter}${seat}`;
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
    if (!selectedSeats.length || selectedSeats.length < totalTickets) {
      alert('Please select the correct number of seats!');
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

  if (!showing) return <p>Loading showing details...</p>;

  return (
    <div>
      <Navbar />
      <div className="booking-grid-wrapper">
        <div className="left-side">
          <div className="left-content">
            <ShowingDetails movie={movie} showing={showing} />
          </div>
        </div>

        <div className="right-side">
          {isOutdated ? (
            <div className="outdated-message">
              <p>This showing is outdated and cannot be booked.</p>
            </div>
          ) : (
            <>
              <TicketSelector
                tickets={tickets}
                handleChange={handleChange}
                totalPrice={totalPrice}
                handleBooking={handleBooking}
              />
              <SeatSelector
                seats={seats}
                selectedSeats={selectedSeats}
                handleSelect={handleSelect}
                totalTickets={totalTickets}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
