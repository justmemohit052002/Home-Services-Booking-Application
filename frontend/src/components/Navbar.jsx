import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

/**
 * Navbar component
 * Sticky top navigation bar with active route highlighting and Dark Mode toggle.
 */
export function Navbar() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('homecare_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('homecare_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon" aria-hidden="true">🏠</span>
          <span className="brand-name">HomeCare</span>
          <span className="brand-tag">Services</span>
        </Link>

        <nav className="navbar-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Home
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            My Bookings
          </NavLink>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="theme-toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <Link to="/book" className="btn btn-primary btn-sm nav-cta">
            + Book Service
          </Link>
        </nav>
      </div>
    </header>
  );
}

