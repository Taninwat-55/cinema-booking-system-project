import { useEffect, useState } from 'react';

const AdminAllBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchMovie, setSearchMovie] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    fetch('http://localhost:3001/api/admin/bookings', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    const filteredData = bookings.filter((booking) => {
      const matchUser = booking.user_name
        .toLowerCase()
        .includes(searchUser.toLowerCase());
      const matchMovie = booking.movie_title
        .toLowerCase()
        .includes(searchMovie.toLowerCase());
      const matchDate = searchDate
        ? new Date(booking.showing_time).toISOString().split('T')[0] ===
          searchDate
        : true;

      return matchUser && matchMovie && matchDate;
    });

    setFiltered(filteredData);
  }, [searchUser, searchMovie, searchDate, bookings]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>All Bookings</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search by user..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <input
          placeholder="Search by movie..."
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Booking #</th>
            <th>User</th>
            <th>Movie</th>
            <th>Showing Time</th>
            <th>Theater</th>
            <th>Seats</th>
            <th>Total (kr)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((booking) => (
            <tr key={booking.booking_id}>
              <td>{booking.booking_number}</td>
              <td>
                {booking.user_name} <br />
                <small>{booking.user_email}</small>
              </td>
              <td>{booking.movie_title}</td>
              <td>{new Date(booking.showing_time).toLocaleString()}</td>
              <td>{booking.theater_id}</td>
              <td>
                {booking.seats && booking.seats.length > 0
                  ? booking.seats.join(', ')
                  : 'N/A'}
              </td>
              <td>{booking.total_price} kr</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p>No bookings found.</p>}
    </div>
  );
};

export default AdminAllBookingsPage;
