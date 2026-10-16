import React from 'react';

/**
 * Loader component
 * Displays a clean spinner and loading status message for asynchronous operations.
 */
export function Loader({ message = 'Loading, please wait...' }) {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
}
