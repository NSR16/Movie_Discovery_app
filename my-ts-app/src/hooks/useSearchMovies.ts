import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

// Removed accessToken argument entirely
export const useSearchMovies = (query: string) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setSearching(true);

      try {
        // Pointing to your serverless endpoint instead of TMDB directly
        const response = await fetch(
          `/api/movies?search=${encodeURIComponent(query)}&page=1`
        );
        
        if (!response.ok) throw new Error('Search request failed');
        
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearching(false);
      }
    }, 500); // Keeping your 500ms debounce delay intact

    return () => clearTimeout(handler);
  }, [query]); // Removed accessToken dependency

  return { results, searching };
};