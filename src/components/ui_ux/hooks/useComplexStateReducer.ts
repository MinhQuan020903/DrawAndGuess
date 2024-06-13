import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useReducer,
} from 'react';

// Reducer để quản lý các hành động phức tạp
function complexReducer(state, action) {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, value: action.payload };
    case 'RESET':
      return { ...state, value: action.initialValue };
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    case 'SET_FETCHED_DATA':
      return { ...state, fetchedData: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_BOOL':
      return { ...state, boolValue: !state.boolValue };
    default:
      return state;
  }
}

// Custom hook
function useComplexStateManager(key, initialValue) {
  // State hook to manage the value
  const [state, dispatch] = useReducer(complexReducer, {
    value: initialValue,
    counter: 0,
    fetchedData: null,
    error: null,
    boolValue: false,
  });

  // Ref to store previous value
  const prevValueRef = useRef();

  // Effect to update local storage when the value changes
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state.value));
  }, [key, state.value]);

  // Effect to update the previous value
  useEffect(() => {
    prevValueRef.current = state.value;
  }, [state.value]);

  // Custom function to reset the value to the initial state
  const resetValue = useCallback(() => {
    dispatch({ type: 'RESET', initialValue });
  }, [initialValue]);

  // Custom function to set a new value
  const setValue = useCallback((newValue) => {
    dispatch({ type: 'SET_VALUE', payload: newValue });
  }, []);

  // Async function to fetch data and update the state
  const fetchData = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      dispatch({ type: 'SET_FETCHED_DATA', payload: result });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  }, []);

  // Effect hook to log the value whenever it changes
  useEffect(() => {
    console.log('Current value:', state.value);
  }, [state.value]);

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

  // Memoized value example
  const memoizedValue = useMemo(() => {
    return state.value * 2;
  }, [state.value]);

  // Increment function
  const increment = useCallback(() => {
    dispatch({ type: 'INCREMENT' });
  }, []);

  // Decrement function
  const decrement = useCallback(() => {
    dispatch({ type: 'DECREMENT' });
  }, []);

  // Toggle boolean value function
  const toggleBool = useCallback(() => {
    dispatch({ type: 'TOGGLE_BOOL' });
  }, []);

  // Effect hook to handle a mock subscription
  useEffect(() => {
    const subscription = {
      subscribe: () => console.log('Subscribed'),
      unsubscribe: () => console.log('Unsubscribed'),
    };

    subscription.subscribe();
    return () => subscription.unsubscribe();
  }, []);

  return {
    value: state.value,
    setValue,
    resetValue,
    fetchData,
    increment,
    decrement,
    memoizedValue,
    prevValue: prevValueRef.current,
    boolValue: state.boolValue,
    toggleBool,
    counter: state.counter,
    error: state.error,
    fetchedData: state.fetchedData,
  };
}

export default useComplexStateManager;
