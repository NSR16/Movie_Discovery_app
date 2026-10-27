// src/hooks/useMovieDetails.ts
import { useState, useEffect } from 'react';
import type { MovieDetail } from '../types/movie';

export const useMovieDetails = (id: string | undefined) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        // Call your secure local endpoint instead of TMDB directly
        const response = await fetch(`/api/movies?id=${id}`);

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
  }, [id]);

  return { movie, isLoading, error };
};