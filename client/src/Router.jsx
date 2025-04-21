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
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminAddMoviePage from './pages/admin/AdminAddMoviePage';
import AdminAddShowingPage from './pages/admin/AdminAddShowingPage';
import AdminMovieListPage from './pages/admin/AdminMovieListPage';
import AdminEditMoviePage from './pages/admin/AdminEditMoviePage';
import AdminAllBookingsPage from './pages/admin/AdminAllBookingPage';
import UserProfilePage from './pages/UserProfilePage';
import UpdateUserInfoPage from './pages/UpdateUserInfoPage';
import TrackBookingPage from './pages/TrackBookingPage';
import AdminEditShowingPage from './pages/admin/AdminEditShowingPage';
import AdminManageShowingsPage from './pages/admin/AdminManageShowingsPage';

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
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/update',
        element: (
          <ProtectedRoute>
            <UpdateUserInfoPage />
          </ProtectedRoute>
        ),
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
      {
        path: 'admin/dashboard',
        element: (
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'admin/add-movie',
        element: (
          <AdminProtectedRoute>
            <AdminAddMoviePage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'admin/add-showing',
        element: (
          <AdminProtectedRoute>
            <AdminAddShowingPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'admin/manage-movies',
        element: (
          <AdminProtectedRoute>
            <AdminMovieListPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'admin/edit-movie/:id',
        element: (
          <AdminProtectedRoute>
            <AdminEditMoviePage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'admin/bookings',
        element: (
          <AdminProtectedRoute>
            <AdminAllBookingsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'track-booking',
        element: <TrackBookingPage />,
      },
      {
        path: 'admin/manage-showings',
        element: (
          <AdminProtectedRoute>
            <AdminManageShowingsPage />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'admin/edit-showing/:id',
        element: (
          <AdminProtectedRoute>
            <AdminEditShowingPage />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
]);
