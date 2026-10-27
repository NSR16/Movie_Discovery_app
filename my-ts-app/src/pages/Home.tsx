// src/pages/Home.tsx
import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useSearchMovies } from '../hooks/useSearchMovies';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import './MovieDetails.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Always call both hooks at the top!
  const { movies: trendingMovies, isLoading } = useMovies();
  const { results: searchResults, searching } = useSearchMovies(searchTerm);

  // Logic to decide which list to show
  const displayMovies = searchTerm ? searchResults : trendingMovies;

  return (
    <div className="home-page">
      <header>
       
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