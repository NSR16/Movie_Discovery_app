// src/hooks/useMovies.ts
import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

export const useMovies = (accessToken: string) => {
  const options={
    method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}` 
        }
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
          options
        );
        
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

    if (accessToken) fetchMovies();
  }, [accessToken]);

  return { movies, isLoading, error };
};