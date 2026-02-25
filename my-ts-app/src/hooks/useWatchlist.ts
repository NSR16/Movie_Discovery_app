// src/hooks/useWatchlist.ts
import { useState, useEffect } from 'react';

export const useWatchlist = () => {
  // Initialize state with whatever is in LocalStorage
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('movie-watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Whenever watchlist changes, save it to LocalStorage
  useEffect(() => {
    localStorage.setItem('movie-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (id: number) => {
    setWatchlist((prev) => 
      prev.includes(id) 
        ? prev.filter(movieId => movieId !== id) // Remove if exists
        : [...prev, id] // Add if doesn't exist
    );
  };

  const isInWatchlist = (id: number) => watchlist.includes(id);

  return { toggleWatchlist, isInWatchlist };
};