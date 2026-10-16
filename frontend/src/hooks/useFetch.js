import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFetch hook
 * Manages loading, error, and data states for async API calls with AbortController cancellation.
 * @param {Function} fetchFn - Function returning a Promise that accepts (signal).
 * @param {Array} deps - Dependency array to trigger refetching.
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store the latest fetchFn in a ref to prevent infinite loops when inline functions are passed
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const execute = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current(controller.signal);
      setData(result);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetchFnRef.current(controller.signal)
      .then((result) => {
        if (isMounted) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted && err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: execute, setData };
}
