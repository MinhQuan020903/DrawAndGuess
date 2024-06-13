// Component sử dụng custom hook
function ExampleComponent() {
  const {
    value,
    setValue,
    resetValue,
    fetchData,
    increment,
    decrement,
    memoizedValue,
    prevValue,
    boolValue,
    toggleBool,
    counter,
    error,
    fetchedData,
  } = useComplexStateManager('myComplexKey', 'Initial Value');

  return (
    <div>
      <h1>useComplexStateManager Custom Hook</h1>
      <p>Current Value: {value}</p>
      <p>Previous Value: {prevValue}</p>
      <p>Memoized Value: {memoizedValue}</p>
      <p>Counter: {counter}</p>
      <p>Boolean Value: {boolValue.toString()}</p>
      <p>Fetched Data: {JSON.stringify(fetchedData)}</p>
      <p>Error: {error ? error.message : 'No error'}</p>
      <button onClick={() => setValue('Updated Value')}>Update Value</button>
      <button onClick={resetValue}>Reset Value</button>
      <button onClick={() => fetchData('https://api.example.com/data')}>
        Fetch Data
      </button>
      <button onClick={increment}>Increment Counter</button>
      <button onClick={decrement}>Decrement Counter</button>
      <button onClick={toggleBool}>Toggle Boolean</button>
    </div>
  );
}

export default ExampleComponent;
