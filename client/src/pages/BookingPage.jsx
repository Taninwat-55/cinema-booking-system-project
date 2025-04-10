import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  if (!showing) return <p>Loading showing details...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTickets((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSelect = (seat) => {
    if (selectedSeats.includes(seat.seat_id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat.seat_id]);
    }
  };

  const totalPrice =
    tickets.adult * 120 + tickets.child * 80 + tickets.senior * 100;

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
    </div>
  );
}

export default BookingPage;
