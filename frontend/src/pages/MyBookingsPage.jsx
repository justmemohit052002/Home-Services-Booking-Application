import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBookings } from '../api/bookingsApi';
import { BookingTable } from '../components/BookingTable';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';

/**
 * MyBookingsPage component
 * Displays all bookings (/bookings) with live cancellation management.
 */
export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookings(signal);
      setBookings(data || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchBookings]);

  // Handle in-place row update after a successful PATCH cancel
  const handleBookingCancelled = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
    );
  };

  return (
    <div className="container page-container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">My Bookings</span>
      </nav>

      <div className="bookings-header">
        <div>
          <h1 className="page-heading">My Service Appointments</h1>
          <p className="page-subheading">
            Track status, review scheduled dates, and manage or cancel existing appointments.
          </p>
        </div>
        <div className="bookings-header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => fetchBookings()}
            disabled={loading}
          >
            ↻ Refresh List
          </button>
          <Link to="/book" className="btn btn-primary btn-sm">
            + New Booking
          </Link>
        </div>
      </div>

      {loading && <Loader message="Fetching bookings from server..." />}

      {error && !loading && (
        <ErrorMessage
          error={error}
          onRetry={() => fetchBookings()}
          title="Failed to Load Bookings"
        />
      )}

      {!loading && !error && bookings.length === 0 && (
        <EmptyState
          title="No bookings found"
          description="You haven't scheduled any service appointments yet."
          actionText="Explore Services & Book"
          actionLink="/"
        />
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="card table-card">
          <BookingTable
            bookings={bookings}
            onBookingCancelled={handleBookingCancelled}
          />
        </div>
      )}
    </div>
  );
}
