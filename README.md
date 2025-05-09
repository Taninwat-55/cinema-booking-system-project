# Cinema Booking System Project

A full-stack cinema booking system where users can browse movies, view showtimes, select seats, and book tickets. Admins can manage movies and showings with ease.

---

## Tech Stack Overview

| Tech           | Usage                        |
| -------------- | ---------------------------- |
| React          | Frontend SPA with Vite       |
| React Router   | Navigation & Dynamic Routing |
| Express.js     | Backend API Server           |
| SQLite         | Lightweight Database         |
| better-sqlite3 | SQLite Integration           |
| Git            | Version Control              |
| GitHub         | Repository Hosting           |

---

## Features Completed ✅

### User Features

- [x] Landing Page — View all movies
- [x] Movie Detail Page — Trailers, descriptions, and showings
- [x] Add to Watchlist (logged-in users)
- [x] Filter movies by title, genre, or year
- [x] Book Tickets — Adult, Child, Senior
- [x] Visual Seat Selection
- [x] Booking Confirmation with Unique Number
- [x] Book as Guest (no login required)
- [x] Auto-delete old bookings
- [x] Register & Login
- [x] My Bookings — Upcoming & History
- [x] Profile Page — Update info, delete account

### Admin System

- [x] Add, Edit, Delete Movies
- [x] Add, Edit, Delete Showings
- [x] Dashboard Stats (total movies, showings, bookings, popular movie)
- [x] View all bookings
- [x] Filter bookings by user, movie, or date

## 🔑 Environment Variables

Create a `.env` file inside the `/server` folder with the following:

```bash
OMDB_API_KEY=your_omdb_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
JWT_SECRET=your_super_secret_key
```
You can use .env.example as a reference.

---

## Getting Started (Clone & Run)

### 1. Clone the Repository

```bash
git clone https://github.com/Taninwat-55/cinema-booking-system-project
cd cinema-booking-system-project
```

### 2. Install Dependencies

```bash
# For Backend
cd server
npm install

# For Frontend
cd ../client
npm install
```

### 3. Setup the Database

Go to the server folder and run the setup script to create tables and insert seed data:

```bash
cd ../server
node seeds/setup.js
node seeds/insertMovies.js
node seeds/insertSeats.js
node seeds/insertShowings.js
node seeds/insertAdmin.js
```

🔐 Admin Credentials:
Email: admin@email.com
Password: adminpassword

### 4. Run the Backend Server

```bash
nodemon server.js | node server.js
```

### 5. Run the Frontend (React Vite)

In a new terminal:

```bash
cd ../client
npm run dev
```

### 6. Access the Application

Open in your browser:

```
http://localhost:5173
```

---

## 🎞️ Optional: YouTube Trailer Auto-Fetch Setup

You can skip this if you’re okay with adding trailers manually.

1.	Go to Google Cloud Console
2.	Enable YouTube Data API v3
3.	Create an API key under Credentials
4.	Add it to your .env as YOUTUBE_API_KEY