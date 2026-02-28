// src/pages/Home.tsx
import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useSearchMovies } from '../hooks/useSearchMovies';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

  // Always call both hooks at the top!
  const { movies: trendingMovies, isLoading } = useMovies(token);
  const { results: searchResults, searching } = useSearchMovies(searchTerm, token);

  // Logic to decide which list to show
  const displayMovies = searchTerm ? searchResults : trendingMovies;

  return (
    <div className="home-page">
      <header>
        <h1>MovieStream</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </header>

      <main>
        <h2>{searchTerm ? `Results for "${searchTerm}"` : 'Trending Now'}</h2>
        
        {searching || isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="movie-grid">
            {displayMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;