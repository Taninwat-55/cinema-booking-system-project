import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

function BookingPage() {
  const { id } = useParams();
  const [showing, setShowing] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({
    adult: 1,
    child: 0,
    senior: 0,
  });

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const totalTickets = tickets.adult + tickets.child + tickets.senior;

  useEffect(() => {
    fetch(`http://localhost:3001/api/showings/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch showing');
        }
        return res.json();
      })
      .then((data) => setShowing(data))
      .catch((error) => {
        console.error(error);
      });

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
    console.log('Trying to select seat:', seat.seat_id);
    console.log('Currently selected seats:', selectedSeats);
    console.log('Total tickets allowed:', totalTickets);

    if (
      !selectedSeats.includes(seat.seat_id) &&
      selectedSeats.length + 1 > totalTickets
    ) {
      console.log('Exceeded ticket limit!');
      alert('You cannot select more seats than tickets!');
      return;
    }

    if (selectedSeats.includes(seat.seat_id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat.seat_id]);
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

    console.log('Booking with data:', {
      showing_id: id,
      total_price: totalPrice,
      selected_seats: selectedSeats,
      user_id: user ? user.user_id : null,
      ticket_details: ticketDetails,
    });

    const res = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showing_id: id,
        total_price: totalPrice,
        selected_seats: selectedSeats,
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
      <h1>Booking Page</h1>
      <h2>Movie: {showing.title}</h2>
      <p>Theater: {showing.theater_id}</p>
      <p>Time: {new Date(showing.showing_time).toLocaleString()}</p>

      <h3>Choose Tickets</h3>
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

      <h3>Total Price: {totalPrice} kr</h3>

      <h3>Choose Seats</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '5px',
        }}
      >
        {seats.map((seat) => (
          <button
            key={seat.seat_id}
            onClick={() => handleSelect(seat)}
            disabled={!seat.is_available}
            style={{
              backgroundColor: selectedSeats.includes(seat.seat_id)
                ? 'green'
                : seat.is_available
                ? 'lightgray'
                : 'darkgray',
              padding: '10px',
            }}
          >
            {seat.row_number}-{seat.seat_number}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Selected Seats:</h3>
        <p>{selectedSeats.join(', ') || 'No seats selected'}</p>
      </div>

      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}

export default BookingPage;
