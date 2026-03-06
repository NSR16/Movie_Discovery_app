import { useEffect, useState } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import './MovieDetails.css';

const Watchlist = () => {
  const { watchlist } = useWatchlist();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      if (watchlist.length === 0) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const moviePromises = watchlist.map(id =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          }).then(res => res.json())
        );

        const results = await Promise.all(moviePromises);
        setMovies(results);
      } catch (err) {
        console.error("Error fetching watchlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [watchlist, token]);

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