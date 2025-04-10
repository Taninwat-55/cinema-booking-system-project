const db = require('../db/database');

db.exec(`DELETE FROM seats;`);

const theaters = db
  .prepare('SELECT theater_id, seats_rows, seats_columns FROM theaters')
  .all();

for (const theater of theaters) {
  const theaterId = theater.theater_id;
  const rows = theater.seats_rows;
  const columns = theater.seats_columns;

  for (let row = 1; row <= rows; row++) {
    for (let seat = 1; seat <= columns; seat++) {
      db.prepare(
        `
        INSERT INTO seats (theater_id, row_number, seat_number, is_available)
        VALUES (?, ?, ?, 1)
      `
      ).run(theaterId, row, seat);
    }
  }
}

console.log('🎟️ Seats inserted for all theaters!');
