const fetch = require('node-fetch');
const pool = require('../db/database');
const movieModel = require('../models/movieModel');
require('dotenv').config();

const imdbIds = process.argv.slice(2);

async function fetchAndInsertMovie(id) {
  async function getYoutubeTrailer(title) {
    const query = `${title} trailer`;
    const apiKey = process.env.YOUTUBE_API_KEY;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${apiKey}&type=video&maxResults=1`;

    try {
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
      return '';
    } catch (err) {
      console.error('YouTube API Error:', err.message);
      return '';
    }
  }

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`
    );
    const data = await res.json();

    if (data.Response === 'False') {
      console.error(`Movie not found for ID: ${id}`);
      return;
    }

    const trailer_url = await getYoutubeTrailer(data.Title);

    await movieModel.createMovie(
      data.Title,
      data.Plot,
      data.Poster,
      trailer_url,
      parseFloat(data.imdbRating) || null,
      parseInt(data.Year),
      parseInt(data.Runtime),
      data.Genre
    );

    console.log(`✅ Movie inserted: ${data.Title}`);
  } catch (err) {
    console.error(`❌ Error fetching movie ${id}: ${err.message}`);
  }
}

async function main() {
  if (imdbIds.length === 0) {
    console.error('Please provide at least one IMDb ID');
    process.exit(1);
  }

  for (const id of imdbIds) {
    await fetchAndInsertMovie(id);
  }

  console.log('Done fetching and inserting movies.');
  await pool.end();
}

main();
