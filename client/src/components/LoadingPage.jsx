// This will both handle the logic and render the UI

import React, { useState, useEffect } from 'react';
import '../styles/component_styles/loadingPage.css'; // Adjust the path as necessary

const LoadingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4800); // Matches animation timing
    return () => clearTimeout(timer);
  }, []);
  
  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="logo-pulse" />
        <p className="loading-text">Loading your cinema experience...</p>
      </div>
    );
  }

  return null; // or you could redirect/render the app if used inside a wrapper
};

export default LoadingPage;
