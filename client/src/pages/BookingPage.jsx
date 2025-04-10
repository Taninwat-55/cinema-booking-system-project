import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BookingPage() {
  const { id } = useParams();
  const [showing, setShowing] = useState(null);
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
  }, [id]);

  if (!showing) return <p>Loading showing details...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTickets((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const totalPrice =
    tickets.adult * 120 + tickets.child * 80 + tickets.senior * 100;

  return (
    <div>
      <h1>Booking Page</h1>
      <h2>Movie: {showing.title}</h2>
      <p>Theater: {showing.theater}</p>
      <p>Time: {new Date(showing.datetime).toLocaleString()}</p>

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

      <button>Choose Seats</button>
    </div>
  );
}

export default BookingPage;
