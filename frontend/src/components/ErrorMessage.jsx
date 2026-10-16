import React from 'react';

/**
 * ErrorMessage component
 * Displays user-friendly error banners with optional Retry action.
 */
export function ErrorMessage({ error, onRetry, title = 'Something went wrong' }) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message || 'An unexpected error occurred.';
  const isNetwork = error.status === 0;

  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <div className="error-content">
        <h4 className="error-title">{isNetwork ? 'Connection Error' : title}</h4>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
