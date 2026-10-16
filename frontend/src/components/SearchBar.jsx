import React from 'react';

/**
 * SearchBar component
 * Controlled text input with immediate clear button.
 */
export function SearchBar({ value, onChange, onClear, placeholder = 'Search by service name (e.g. cleaning, repairs)...' }) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-group">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search services"
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
