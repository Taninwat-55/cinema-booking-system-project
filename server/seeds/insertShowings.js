const pool = require('../db/database');

async function main() {
  await pool.query(`DELETE FROM showings`);

  const movies = await pool.query('SELECT movie_id FROM movies');
  const theaters = await pool.query('SELECT theater_id FROM theaters');

  const now = new Date();

  for (const movie of movies.rows) {
    for (const theater of theaters.rows) {
      for (let i = 0; i < 3; i++) {
        const dateTime = new Date(now);
        dateTime.setDate(now.getDate() + i);
        dateTime.setHours(18 + i, 0, 0, 0);

        await pool.query(
          `INSERT INTO showings (movie_id, theater_id, showing_time, price_adult, price_child, price_senior)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [movie.movie_id, theater.theater_id, dateTime.toISOString(), 120, 80, 100]
        );
      }
    }
  }

  console.log('🎟️ Showings inserted!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Failed to seed showings:', err.message);
  process.exit(1);
});
