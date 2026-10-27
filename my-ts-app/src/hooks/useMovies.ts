import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

// Removed accessToken argument entirely
export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        // Call your local proxy endpoint with type=popular parameter
        const response = await fetch('/api/movies?type=popular');
        
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []); // Empty dependency array means this runs once on mount safely

  return { movies, isLoading, error };
};