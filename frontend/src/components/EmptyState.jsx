import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EmptyState component
 * Displayed when lists (services, bookings) return 0 records.
 */
export function EmptyState({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionText,
  actionLink,
  onAction,
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon" aria-hidden="true">📋</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
      {!actionLink && onAction && actionText && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
