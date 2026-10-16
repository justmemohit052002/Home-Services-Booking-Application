/**
 * apiClient.js
 * Centralized HTTP request client using native fetch.
 * Handles headers, JSON serialization, HTTP status verification,
 * structured error formatting, and AbortController signals.
 */

export async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Accept': 'application/json',
  };

  // Only attach Content-Type if there is a body payload
  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response;
  try {
    response = await fetch(endpoint, config);
  } catch (error) {
    // If the request was aborted intentionally by an AbortController, rethrow
    if (error.name === 'AbortError') {
      throw error;
    }
    // Network failures (Spring Boot server down, connection refused)
    throw {
      status: 0,
      message: 'Cannot reach the server. Please try again.',
      fieldErrors: {},
      raw: error,
    };
  }

  // Safe response parsing: handle empty bodies and non-JSON content gracefully
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  // Check HTTP response code (200 - 299)
  if (!response.ok) {
    // Extract field-wise error map matching Spring Boot GlobalExceptionHandler
    // 400 Bad Request: { timestamp, status: 400, message: "Validation failed", errors: { field: message } }
    // 404 Not Found: { timestamp, status: 404, message: "...", errors: null }
    const fieldErrors =
      data && typeof data === 'object' && data.errors && typeof data.errors === 'object'
        ? data.errors
        : {};

    const message =
      data && typeof data === 'object' && data.message
        ? data.message
        : typeof data === 'string' && data.length > 0
        ? data
        : `Request failed with status ${response.status}`;

    throw {
      status: response.status,
      message,
      fieldErrors,
      raw: data,
    };
  }

  return data;
}
