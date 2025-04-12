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

### User Authentication System

- [x] User Registration Page
- [x] User Login Page
- [x] Login State Management (Context API)
- [x] View My Bookings (Upcoming & History)

---

## Features In Progress 🛠️

### Admin System

- [ ] Watchlist feature for logged-in user
- [ ] Admin can create, read, delete movies
- [ ] Admin can add showings for movies
- [ ] Admin authentication (optional)

---

## Planned Features 🎯

### Coming Soon

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
│   │   ├── assets/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/      # Global state management (for user login later)
│   │   │   └── UserContext.jsx
│   │   ├── pages/        # All pages
│   │   │   ├── BookingConfirmationPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MovieDetailPage.jsx
│   │   │   └── MyBookingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   ├── styles/
│   │   │   └── App.css
│   │   │   └── index.css
│   │   ├── App.jsx       # Main layout with <Outlet />
│   │   └── main.jsx      # React entry point
│   │   ├── Router.jsx    # React Router setup with createBrowserRouter
│
├── server/               # Express Backend
│   ├── routes/           # Route definitions
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── seatRoutes.js
│   │   ├── showingRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── controllers/      # Route logic / Handlers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── movieController.js
│   │   ├── seatController.js
│   │   ├── showingController.js
│   │   └── userController.js
│   │
│   ├── models/
│   │   ├── bookingModel.js
│   │   └── userModel.js
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
```

### 4. Run the Backend Server

```bash
nodemone server.js
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
