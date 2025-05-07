# Cinema Booking System Project

This is a full-stack cinema booking system built with:

- Frontend: React (Vite) + React Router + Context API
- Backend: Express.js + SQLite (better-sqlite3)
- RESTful API Design
- Clean Folder Structure for Beginner-Friendly Collaboration

---

## Features Completed ✅

### User Features

- [x] Landing Page — Show all movies
- [x] Movie Detail Page — Show movie details, trailers, and showings
- [x] Add movies to a personal Watchlist (for logged-in users)
- [x] View a list of current movies
- [x] Booking Page — Select ticket types (Adult, Child, Senior) + calculated total price
- [x] Seat Selection — Visual seat map with availability
- [x] Booking Confirmation — Generate unique booking number
- [x] Book a movie without log-in
- [x] Auto Delete Old Bookings
- [x] Create an account and log in
- [x] Login State Management (Context API)
- [x] View My Bookings (Upcoming & History)
- [x] User Profile & User Update

### Admin System

- [x] Admin can create, read, delete movies
- [x] Admin can add, edit and delete showings for movies
- [x] Search & Filter by title and genre
- [x] Admin Dashboard Stats
- [x] View all user bookings

```
In order for you to be able to fetch the trailers automatically when adding a movie, you'll need Google Cloud API key. In order to do that, you'll need to:

1. Get a Youtube API key
- Go to Google Developers Console and enable Youtube Data API v3. Then create a key from Credentials page.

2. Update the .env by adding your Youtube API key.
- YOUTUBE_API_KEY=your_youtube_api_key

3. It's all set.
```

# Important Note:

## 🔑 Environment Variables

Before running the backend, create a `.env` file inside the `/server` folder with the following: 

JWT_SECRET=my_super_secret_key_123

You can use any string as the secret. This is required for login/register to work.

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

## Getting Started (Clone & Run)

### 1. Clone the Repository

```bash
git clone https://github.com/Taninwat-55/cinema-booking-system-project
cd cinema-booking-system-project
```

### 2. Install Dependencies

Install both frontend and backend dependencies:

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

After running insertAdmin, here are Admin's email and password:
Email: admin@email.com
Password: adminpassword

### 4. Run the Backend Server

```bash
nodemone server.js | node server.js
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
http://localhost:5173 or http://localhost:5174
```

---
