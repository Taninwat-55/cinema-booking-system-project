const db = require('../db/database');

db.exec(`DELETE FROM showings;`);

const movies = db.prepare('SELECT movie_id FROM movies').all();
const theaters = db.prepare('SELECT theater_id FROM theaters').all();

const now = new Date();
const showings = [];

for (const movie of movies) {
  for (const theater of theaters) {
    for (let i = 0; i < 3; i++) {
      const dateTime = new Date(now);
      dateTime.setDate(now.getDate() + i);
      dateTime.setHours(18 + i, 0); // 18:00, 19:00, 20:00

      showings.push({
        movie_id: movie.movie_id,
        theater_id: theater.theater_id,
        showing_time: dateTime.toISOString(),
        price_adult: 120,
        price_child: 80,
        price_senior: 100,
      });
    }
  }
}

const stmt = db.prepare(`
  INSERT INTO showings (movie_id, theater_id, showing_time, price_adult, price_child, price_senior)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const showing of showings) {
  stmt.run(
    showing.movie_id,
    showing.theater_id,
    showing.showing_time,
    showing.price_adult,
    showing.price_child,
    showing.price_senior
  );
}

console.log('🎟️ Showings inserted!');
