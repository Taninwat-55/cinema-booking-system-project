import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router.jsx';
import { UserProvider } from './context/UserContext';
import './styles/index.css';
import { SearchProvider } from './context/SearchContext.jsx';
import { Toaster } from 'react-hot-toast';
import { WatchlistProvider } from './context/WatchlistContext.jsx'; // ✅ FIXED here

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <SearchProvider>
        <WatchlistProvider> 
          <RouterProvider router={router} />
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </WatchlistProvider>
      </SearchProvider>
    </UserProvider>
  </StrictMode>
);