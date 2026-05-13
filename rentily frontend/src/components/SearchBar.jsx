import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search for products to rent or buy...' }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-inner">
        <span className="searchbar-icon">🔍</span>
        <input
          type="text"
          className="searchbar-input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        {value && (
          <button className="searchbar-clear" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
        <button className="searchbar-btn">Search</button>
      </div>
    </div>
  );
};

export default SearchBar;