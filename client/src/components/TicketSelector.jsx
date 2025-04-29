function TicketSelector({ tickets, handleChange, totalPrice, handleBooking }) {
  return (
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
  );
}

export default TicketSelector;
