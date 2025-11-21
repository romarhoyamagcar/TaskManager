import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing values
 * @param {*} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {*} - The debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debounced callback
 * @param {Function} callback - The callback to debounce (should be memoized by caller)
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced callback
 */
export const useDebouncedCallback = (callback, delay = 300) => {
  const timerRef = useRef();

  const debouncedCallback = useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export default useDebounce;
