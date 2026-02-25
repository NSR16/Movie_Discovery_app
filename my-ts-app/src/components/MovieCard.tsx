// src/components/MovieCard.tsx
import type { Movie } from '../types/movie';
import { Link } from 'react-router-dom';

interface Props {
  movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
  // TMDB images need a base URL
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link to={`movie/${movie.id}`} className='movie-card'>
        <div className="movie-card">
        <img src={imageUrl} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
        </div>
  </Link>
  );
};

export default MovieCard;