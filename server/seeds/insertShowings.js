const db = require('../db/database');

db.exec(`DELETE FROM showings;`);

const movies = db.prepare('SELECT movie_id FROM movies').all();

const now = new Date();

const showings = [];

for (const movie of movies) {
  for (let i = 0; i < 3; i++) {
    const dateTime = new Date(now);
    dateTime.setDate(now.getDate() + i); // today, tomorrow, etc
    dateTime.setHours(18 + i, 0); // 18:00, 19:00, 20:00

    showings.push({
      movie_id: movie.movie_id,
      datetime: dateTime.toISOString(),
      theater: `Theater ${i + 1}`,
    });
  }
}

const stmt = db.prepare(`
  INSERT INTO showings (movie_id, datetime, theater)
  VALUES (?, ?, ?)
`);

for (const showing of showings) {
  stmt.run(showing.movie_id, showing.datetime, showing.theater);
}

console.log('🎟️ Showings inserted!');
