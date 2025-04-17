import { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false); //

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        searchTerm,
        setSearchTerm,
        hasSearched,
        setHasSearched,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
