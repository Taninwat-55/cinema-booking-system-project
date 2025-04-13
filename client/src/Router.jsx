import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import MovieDetailPage from './pages/MovieDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MyBookingPage from './pages/MyBookingPage';
import ProtectedRoute from './components/ProtectedRoute';
import WatchlistPage from './pages/WatchlistPage';
import BookingHistoryPage from './pages/BookingHistoryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'movies/:id',
        element: <MovieDetailPage />,
      },
      {
        path: 'book/:id',
        element: <BookingPage />,
      },
      {
        path: 'booking-confirmation/:bookingNumber',
        element: <BookingConfirmationPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'my-bookings',
        element: (
          <ProtectedRoute>
            <MyBookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/watchlist',
        element: (
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/booking-history',
        element: (
          <ProtectedRoute>
            <BookingHistoryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
