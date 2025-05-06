import React, { useState, useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router.jsx';
import { UserProvider } from './context/UserContext';
import './styles/index.css';
import { SearchProvider } from './context/SearchContext.jsx';
import { Toaster } from 'react-hot-toast';
import { WatchlistProvider } from './context/WatchlistContext.jsx';
import LoadingPage from './components/LoadingPage'; // ✅ Import only this

const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // ⏳ Duration of loading screen
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingPage />; // ✅ Your loading screen (only once)

  // ✅ Your original return, untouched
  return (
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
};

createRoot(document.getElementById('root')).render(<Root />);
