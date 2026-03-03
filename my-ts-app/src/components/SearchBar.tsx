// src/components/SearchBar.tsx
import './Search.css';

interface SearchProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: SearchProps) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;