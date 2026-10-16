import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { formatDisplayDate } from '../utils/formatters';
import { cancelBooking } from '../api/bookingsApi';

/**
 * BookingTable component
 * Renders the table of customer bookings and manages interactive cancellation.
 */
export function BookingTable({ bookings = [], onBookingCancelled }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleCancelClick = async (booking) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel booking #${booking.id} (${booking.serviceName})?`
    );
    if (!confirmed) return;

    setCancellingId(booking.id);
    setActionError(null);

    try {
      // Calls PATCH /api/bookings/{id}/cancel
      const updated = await cancelBooking(booking.id);
      if (onBookingCancelled) {
        onBookingCancelled(updated);
      }
    } catch (err) {
      setActionError(err.message || `Failed to cancel booking #${booking.id}.`);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="table-responsive">
      {actionError && (
        <div className="table-error-banner" role="alert">
          {actionError}
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Service</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            const isThisCancelling = cancellingId === booking.id;

            return (
              <tr key={booking.id} className={isCancelled ? 'row-cancelled' : ''}>
                <td className="cell-id">#{booking.id}</td>
                <td className="cell-service">{booking.serviceName || 'Unknown Service'}</td>
                <td>{booking.name || 'N/A'}</td>
                <td>{booking.phone || 'N/A'}</td>
                <td>{formatDisplayDate(booking.date)}</td>
                <td>{booking.timeSlot || 'N/A'}</td>
                <td>
                  <StatusBadge status={booking.status} />
                </td>
                <td>
                  <button
                    type="button"
                    className={`btn btn-sm ${isCancelled ? 'btn-secondary' : 'btn-danger'}`}
                    disabled={isCancelled || isThisCancelling}
                    onClick={() => handleCancelClick(booking)}
                    aria-label={`Cancel booking #${booking.id}`}
                  >
                    {isThisCancelling
                      ? 'Cancelling...'
                      : isCancelled
                      ? 'Cancelled'
                      : 'Cancel'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
