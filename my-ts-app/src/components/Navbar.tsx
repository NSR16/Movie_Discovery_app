import { Link } from 'react-router-dom';
import '../App.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎬 MovieStream</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
      </div>
    </nav>
  );
};

export default Navbar;