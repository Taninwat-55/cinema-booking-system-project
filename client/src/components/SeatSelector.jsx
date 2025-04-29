function SeatSelector({ seats, selectedSeats, handleSelect }) {
  const getSeatLabel = (row, seat) => String.fromCharCode(64 + row) + seat;

  return (
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
                .sort()
                .join(', ')
            : 'No seats selected'}
        </p>
      </div>
    </div>
  );
}

export default SeatSelector;
