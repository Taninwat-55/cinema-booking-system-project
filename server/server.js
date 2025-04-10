const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const movieRoutes = require('./routes/movieRoutes');
const showingRoutes = require('./routes/showingRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/movies', movieRoutes);
app.use('/api/showings', showingRoutes);

app.get('/', (req, res) => {
  res.send('Cinema Booking System Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
