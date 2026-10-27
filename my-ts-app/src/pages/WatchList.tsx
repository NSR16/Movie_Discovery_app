import { useEffect, useState } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import './MovieDetails.css';

const Watchlist = () => {
  const { watchlist } = useWatchlist();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      if (watchlist.length === 0) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const moviePromises = watchlist.map(id =>
          // Pointing to your proxy route instead of TMDB directly
          fetch(`/api/movies?id=${id}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch movie ${id}`);
            return res.json();
          })
        );

        const results = await Promise.all(moviePromises);
        // Optional: Filter out any null/undefined results if a specific call failed
        setMovies(results.filter(movie => movie && movie.id));
      } catch (err) {
        console.error("Error fetching watchlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [watchlist]); // Removed token from the dependency array

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {loading ? (
        <p>Loading your list...</p>
      ) : movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>Your watchlist is empty. Start adding some movies!!</p>
      )}
    </div>
  );
};

export default Watchlist;