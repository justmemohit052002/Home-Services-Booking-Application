/**
 * bookingsApi.js
 * API client methods for the /api/bookings endpoints.
 */

import { request } from './apiClient';

/**
 * Fetches all customer bookings.
 * @param {AbortSignal} [signal] - Optional AbortController signal
 */
export async function getBookings(signal) {
  return request('/api/bookings', {
    method: 'GET',
    signal,
  });
}

/**
 * Submits a new booking request.
 * @param {Object} bookingPayload - Booking form data
 */
export async function createBooking(bookingPayload) {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingPayload),
  });
}

/**
 * Cancels an existing booking by ID (Bonus backend feature).
 * @param {number|string} id - Booking ID
 */
export async function cancelBooking(id) {
  return request(`/api/bookings/${encodeURIComponent(id)}/cancel`, {
    method: 'PATCH',
  });
}
