import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/WatchList";
import Navbar from "./components/Navbar";



function App(){
  
  
    return (<>
    <Navbar />
   <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/movie/:id" element={<MovieDetails/>}/>
    <Route path="/watchlist" element={<Watchlist />} />
    
   </Routes>
   </>  
  );
  }

export default App;