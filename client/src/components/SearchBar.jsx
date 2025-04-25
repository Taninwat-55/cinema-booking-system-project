import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';
import '../styles/component_styles/SearchBar.css';


const SearchBar = () => {
  const { searchTerm, setSearchTerm, setSearchResults, setHasSearched } =
    useContext(SearchContext);

  const handleSearch = async (value) => {
    if (!value.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/movies?search=${encodeURIComponent(value)}`
      );
      const data = await response.json();
      setSearchResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      handleSearch(value);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
      {/* <span className="search-icon">🔍</span> */}
    </div>
  );
};

export default SearchBar;