import { useMovies } from '../hooks/useMovies';
import MovieCard from '../components/MovieCard';
import '../App.css'


function Home(){
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  const ACCESS_TOKEN=token;

  const {movies,isLoading,error}=useMovies(ACCESS_TOKEN);

  if(isLoading) return <div>Loading moives...</div>
  if(error) return <div>Error:{error}</div>
  
    return (
    <div className="app-container">
      <h1>Trending Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
     
  );
  }

export default Home;