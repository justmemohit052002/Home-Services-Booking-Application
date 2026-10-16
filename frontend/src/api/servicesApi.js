/**
 * servicesApi.js
 * API client methods for the /api/services endpoints.
 */

import { request } from './apiClient';

/**
 * Fetches all services or filters by search keyword.
 * @param {string} search - Search query term
 * @param {AbortSignal} [signal] - Optional AbortController signal
 */
export async function getServices(search = '', signal) {
  const trimmed = search.trim();
  const endpoint = trimmed
    ? `/api/services?search=${encodeURIComponent(trimmed)}`
    : '/api/services';

  return request(endpoint, {
    method: 'GET',
    signal,
  });
}

/**
 * Fetches details for a single service by ID.
 * @param {number|string} id - Service ID
 * @param {AbortSignal} [signal] - Optional AbortController signal
 */
export async function getServiceById(id, signal) {
  return request(`/api/services/${encodeURIComponent(id)}`, {
    method: 'GET',
    signal,
  });
}
