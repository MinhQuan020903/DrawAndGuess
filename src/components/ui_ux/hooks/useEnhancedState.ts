import { useState, useEffect, useCallback } from 'react';

// Custom hook
function useEnhancedState(key, initialValue) {
  // State hook to manage the value
  const [value, setValue] = useState(() => {
    // Check local storage for the initial value
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  // Effect hook to update local storage when the value changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Custom function to reset the value to the initial state
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Async function to fetch data and update the state
  const fetchData = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      setValue(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  // Effect hook to log the value whenever it changes
  useEffect(() => {
    console.log('Current value:', value);
  }, [value]);

  // Effect hook to manage window resize events
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized:', {
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    value,
    setValue,
    resetValue,
    fetchData,
  };
}

export default useEnhancedState;
