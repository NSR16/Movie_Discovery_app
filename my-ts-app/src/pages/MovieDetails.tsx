// src/pages/MovieDetails.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useWatchlist } from '../hooks/useWatchlist';
import './MovieDetails.css'; 

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // For the "Back" button
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  
  const { movie, isLoading, error } = useMovieDetails(id, token);

   const { toggleWatchlist, isInWatchlist } = useWatchlist();
  
  const movieIsSaved = isInWatchlist(Number(id));

  if (isLoading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return null;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

 
  return (
    <div className="details-page">
      <button className='back-btn' onClick={() => navigate(-1)}>← Back</button>
      
      <div 
        className="hero" 
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="hero-overlay">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline}</p>
        </div>
      </div>

      <div className="content">
        <button 
          className={`watchlist-btn ${movieIsSaved ? 'saved' : ''}`}
          onClick={() => toggleWatchlist(Number(id))}
        >
          {movieIsSaved ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
        </button>
        <p>{movie.overview}</p>
        <div className="stats">
          <span>Release Date: {movie.release_date}</span>
          <span>Runtime: {movie.runtime} mins</span>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;