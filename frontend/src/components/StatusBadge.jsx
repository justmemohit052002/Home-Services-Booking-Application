import React from 'react';

/**
 * StatusBadge component
 * Displays styled badge for booking statuses: PENDING (amber) or CANCELLED (muted strikethrough).
 */
export function StatusBadge({ status }) {
  const normalized = status ? String(status).toUpperCase() : 'PENDING';
  const isPending = normalized === 'PENDING';
  const isCancelled = normalized === 'CANCELLED';

  const badgeClass = isPending
    ? 'badge-status badge-pending'
    : isCancelled
    ? 'badge-status badge-cancelled'
    : 'badge-status';

  return <span className={badgeClass}>{normalized}</span>;
}
