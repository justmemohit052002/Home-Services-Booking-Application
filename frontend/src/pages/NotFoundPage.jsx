import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage component
 * Fallback route for unmatched frontend URLs.
 */
export function NotFoundPage() {
  return (
    <div className="container page-container">
      <div className="card not-found-card">
        <span className="not-found-icon" aria-hidden="true">🗺️</span>
        <h2>404 - Page Not Found</h2>
        <p className="not-found-msg">
          The page you requested does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
