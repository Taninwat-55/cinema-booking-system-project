const pool = require('../db/database');

async function main() {
  await pool.query(`DELETE FROM movies`);

  const rawMovies = [
    {
      imdbID: 'tt0111161',
      Title: 'The Shawshank Redemption',
      Plot: 'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.',
      Runtime: '142',
      Year: '1994',
      Director: 'Frank Darabont',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg',
      Trailer_url: 'https://youtu.be/PLl99DlL6b4?si=yPk1dch7uUHOPKwG',
      Genre: 'Drama',
      imdb_rating: '9.3',
    },
    {
      imdbID: 'tt1375666',
      Title: 'Inception',
      Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
      Runtime: '148',
      Year: '2010',
      Director: 'Christopher Nolan',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      Trailer_url: 'https://youtu.be/YoHD9XEInc0?si=4s_9RpCE_959DMYL',
      Genre: 'Action, Adventure, Sci-Fi',
      imdb_rating: '8.8',
    },
    {
      imdbID: 'tt0317219',
      Title: 'Cars',
      Plot: "On the way to the biggest race of his life, a hotshot rookie race car gets stranded in a rundown town and learns that winning isn't everything in life.",
      Runtime: '116',
      Year: '2006',
      Director: 'John Lasseter, Joe Ranft',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTg5NzY0MzA2MV5BMl5BanBnXkFtZTYwNDc3NTc2._V1_SX300.jpg',
      Trailer_url: 'https://youtu.be/W_H7_tDHFE8?si=gZvRQqgnrP1wWwQJ',
      Genre: 'Animation, Adventure, Comedy',
      imdb_rating: '7.3',
    },
    {
      imdbID: 'tt0068646',
      Title: 'The Godfather',
      Plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      Runtime: '175',
      Year: '1972',
      Director: 'Francis Ford Coppola',
      Poster: 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg',
      Trailer_url: 'https://youtu.be/UaVTIH8mujA?si=IXUn1M7AwP6a4251',
      Genre: 'Crime, Drama',
      imdb_rating: '9.2',
    },
    {
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Plot: 'When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.',
      Runtime: '152',
      Year: '2008',
      Director: 'Christopher Nolan',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      Trailer_url: 'https://youtu.be/EXeTwQWrcwY?si=KrmiZgsxsz11js2L',
      Genre: 'Action, Crime, Drama',
      imdb_rating: '9.0',
    },
    {
      imdbID: 'tt0109830',
      Title: 'Forrest Gump',
      Plot: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
      Runtime: '142',
      Year: '1994',
      Director: 'Robert Zemeckis',
      Poster: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg',
      Trailer_url: 'https://youtu.be/Mj9IA9tTfio?si=rp8nQB_ufr2WDQwm',
      Genre: 'Drama, Romance',
      imdb_rating: '8.8',
    },
  ];

  for (const movie of rawMovies) {
    await pool.query(
      `INSERT INTO movies (imdb_id, title, description, length_minutes, release_year, director, poster_url, trailer_url, genre, imdb_rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        movie.imdbID,
        movie.Title,
        movie.Plot,
        parseInt(movie.Runtime),
        parseInt(movie.Year),
        movie.Director,
        movie.Poster,
        movie.Trailer_url,
        movie.Genre,
        parseFloat(movie.imdb_rating),
      ]
    );
  }

  console.log('🎬 Seeded movies!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Failed to seed movies:', err.message);
  process.exit(1);
});
