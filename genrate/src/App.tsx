import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ChapterView from './components/ChapterView';
import VideoGenerator from './components/VideoGenerator';
import VideoPlayer from './components/VideoPlayer';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import './App.css';

const App: React.FC = () => {
  const isOffline = useOfflineStatus();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="App">
      <Header isOnline={isOnline} />
      
      {!isOnline && (
        <div className="offline-banner">
          <div className="container">
            <div className="flex-center">
              <span className="offline-icon">📡</span>
              <span>You're currently offline. Some features may be limited.</span>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subject/:subject" element={<ChapterView />} />
          <Route path="/chapter/:subject/:chapterId" element={<VideoGenerator />} />
          <Route path="/video/:videoId" element={<VideoPlayer />} />
        </Routes>
      </main>
    </div>
  );
};

export default App; 