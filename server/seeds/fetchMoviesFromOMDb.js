const fetch = require('node-fetch'); // Remember to use node-fetch@2
const db = require('../db/database');
const movieModel = require('../models/movieModel');
require('dotenv').config();

const apiKey = process.env.OMDB_API_KEY;

const imdbIds = process.argv.slice(2); // Accept multiple ids

async function fetchAndInsertMovie(id) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`
    );
    const data = await res.json();

    if (data.Response === 'False') {
      console.error(`Movie not found for ID: ${id}`);
      return;
    }

    const title = data.Title;
    const description = data.Plot;
    const poster_url = data.Poster;
    const imdb_rating = data.imdbRating;
    const trailer_url = ''; // Optional for now
    const release_year = data.Year;
    const length_minutes = data.Runtime; // it's like "136 min"
    const genre = data.Genre;

    movieModel.createMovie(
      title,
      description,
      poster_url,
      trailer_url,
      imdb_rating,
      release_year,
      length_minutes,
      genre
    );
    console.log(`Movie inserted: ${title}`);
  } catch (err) {
    console.error(`Error fetching movie ${id}: ${err.message}`);
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
}

main();
