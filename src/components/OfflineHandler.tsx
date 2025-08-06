'use client';

import { useEffect } from 'react';

export default function OfflineHandler() {
  useEffect(() => {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          console.log('Service Worker registered successfully for offline functionality');
        })
        .catch((registrationError) => {
          console.log('Service Worker registration failed: ', registrationError);
        });
    }
  }, []);

  // Return null - no visible UI elements
  return null;
} 