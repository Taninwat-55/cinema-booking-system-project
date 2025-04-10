# Cinema Booking System Project

This is a full-stack cinema booking system built with:

- Frontend: React (Vite) + React Router + Context API
- Backend: Express.js + SQLite (better-sqlite3)
- RESTful API Design
- Clean Folder Structure for Beginner-Friendly Collaboration

---

## Features Completed ✅

### Movie Exploration

- [x] Landing Page — Show all movies
- [x] Movie Detail Page — Show movie details, trailers, and showings

### Booking System

- [x] Booking Page — Select ticket types (Adult, Child, Senior)
- [x] Seat Selection — Visual seat map with availability
- [x] Booking Confirmation — Generate unique booking number

---

## Features In Progress 🛠️

### User Authentication System

- [ ] User Registration Page
- [ ] User Login Page
- [ ] Login State Management (Context API)
- [ ] View My Bookings (Upcoming & History)

---

## Planned Features 🎯

### Admin System

- [ ] Admin can create, read, delete movies
- [ ] Admin can add showings for movies
- [ ] Admin authentication (optional)

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

## Project Structure Overview

```bash
cinema-booking-system-project/
├── client/               # React Frontend
│   ├── src/
│   │   ├── pages/        # All pages
│   │   ├── BookingConfirmation.jsx
│   │   ├── BookingPage.jsx
│   │   ├── LandingPage.jsx
│   │   └── MovieDetailPage.jsx
│   │   ├── components/
│   │   └── Navbar.jsx    # Reusable UI components
│   │   ├── context/      # Global state management (for user login later)
│   │   ├── Router.jsx    # React Router setup with createBrowserRouter
│   │   ├── App.jsx       # Main layout with <Outlet />
│   │   └── main.jsx      # React entry point
│
├── server/               # Express Backend
│   ├── routes/           # Route definitions
│   │   ├── movieRoutes.js
│   │   ├── showingRoutes.js
│   │   ├── seatRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── controllers/      # Route logic / Handlers
│   │   ├── movieController.js
│   │   ├── showingController.js
│   │   ├── seatController.js
│   │   └── bookingController.js
│   │
│   ├── seed/             # Database seeding scripts
│   │   ├── setup.js             # Create tables
│   │   ├── insertMovies.js      # Insert movie data
│   │   ├── insertShowings.js    # Insert showings per movie
│   │   └── insertSeats.js       # Generate seats per theater
│   │
│   ├── db/               # Database config and file
│   │   ├── cinema.db
│   │   └── database.js
│   │
│   └── server.js         # Main server file (Express app setup)
```
