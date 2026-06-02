const pool = require('../db/database');

async function main() {
  await pool.query(`DELETE FROM seats`);

  const theaters = await pool.query('SELECT theater_id, seats_rows, seats_columns FROM theaters');

  for (const theater of theaters.rows) {
    const { theater_id, seats_rows, seats_columns } = theater;

    for (let row = 1; row <= seats_rows; row++) {
      for (let seat = 1; seat <= seats_columns; seat++) {
        await pool.query(
          `INSERT INTO seats (theater_id, row_number, seat_number, is_available) VALUES ($1, $2, $3, 1)`,
          [theater_id, row, seat]
        );
      }
    }
  }

  console.log('🎟️ Seats inserted for all theaters!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Failed to seed seats:', err.message);
  process.exit(1);
});
