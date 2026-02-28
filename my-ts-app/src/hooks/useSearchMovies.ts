// src/hooks/useSearchMovies.ts
import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

export const useSearchMovies = (query: string, accessToken: string) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setSearching(true);
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearching(false);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(handler); // Cleanup the timer if query changes
  }, [query, accessToken]);

  return { results, searching };
};