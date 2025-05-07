
import React, { useState, useEffect } from 'react';
import '../styles/component_styles/loadingPage.css';

const LoadingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4800);
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
  return null;
};

export default LoadingPage;
