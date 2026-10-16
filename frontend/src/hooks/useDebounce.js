import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * Delays updating the debounced value until after a specified time has elapsed
 * since the last time the source value changed.
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default 400ms)
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timeout if value or delay changes before handler executes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
