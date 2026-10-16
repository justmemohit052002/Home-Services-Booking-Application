/**
 * formatters.js
 * Utility functions for formatting prices, ratings, and dates consistently.
 */

/**
 * Formats a number to Indian Rupee (INR) currency representation.
 * Example: 999 -> "₹999.00"
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Price on request';
  }
  return `₹${amount.toFixed(2)}`;
}

/**
 * Formats a decimal rating with star icon.
 * Example: 4.5 -> "★ 4.5 / 5.0"
 */
export function formatRating(rating) {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return '★ Unrated';
  }
  return `★ ${rating.toFixed(1)} / 5.0`;
}

/**
 * Formats ISO date string (yyyy-MM-dd) to human-readable format (DD/MM/YYYY).
 * Example: "2026-10-25" -> "25/10/2026"
 */
export function formatDisplayDate(isoDateStr) {
  if (!isoDateStr || typeof isoDateStr !== 'string') return 'N/A';
  const parts = isoDateStr.split('-');
  if (parts.length !== 3) return isoDateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Returns today's date formatted as yyyy-MM-dd for HTML min date attributes.
 */
export function getTodayDateStr() {
  return new Date().toISOString().split('T')[0];
}
