import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  disabled: boolean;
  placeholder?: string;
}

/**
 * SearchBar component for natural language file search
 * Features debounced input and clear button
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  disabled,
  placeholder = 'Search files... (e.g., "invoice from last week", "birthday photo")',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Search files"
        />
        {value && (
          <button
            className="clear-button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button
        className="search-button"
        onClick={() => onSearch(value)}
        disabled={disabled || !value.trim()}
        aria-label="Search"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
