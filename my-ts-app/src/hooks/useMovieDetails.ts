// src/hooks/useMovieDetails.ts
import { useState, useEffect } from 'react';
import type { MovieDetail } from '../types/movie'; // Using the detailed interface

export const useMovieDetails = (id: string | undefined, accessToken: string) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      };

      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          options
        );

        if (!response.ok) throw new Error('Could not find movie details');

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id, accessToken]);

  return { movie, isLoading, error };
};