import { useState, useEffect, useContext, createContext } from 'react';
import TronWeb from 'tronweb'; // Assuming TronWeb is available globally

// Context to manage error and event states
const ErrorContext = createContext();

export const useErrorContext = () => useContext(ErrorContext);

// Generic hook to manage both error handling and event subscription
const useSmartContract = (contractAddress, abi) => {
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(null);

  // Subscribe to contract events
  const subscribeToEvent = (eventName) => {
    const contract = TronWeb.contract(abi, contractAddress);
    
    contract[eventName]().watch((err, result) => {
      if (err) {
        setError(err);
        return;
      }
      setEvents(prevEvents => [...prevEvents, result]);
    });
  };

  // Unsubscribe from contract events
  const unsubscribeFromEvent = (eventName) => {
    const contract = TronWeb.contract(abi, contractAddress);
    
    contract[eventName]().stopWatching();
  };

  // Send transaction and handle reverts
  const sendTransaction = async (functionName, ...args) => {
    try {
      const contract = TronWeb.contract(abi, contractAddress);
      const response = await contract[functionName](...args).send();
      
      if (response.result) {
        setTransactionStatus('Success');
      }
    } catch (err) {
      setTransactionStatus('Failed');
      if (err.message.includes('revert')) {
        setError('Transaction reverted: ' + err.message);
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  return {
    error,
    events,
    transactionStatus,
    subscribeToEvent,
    unsubscribeFromEvent,
    sendTransaction
  };
};

// ErrorProvider to wrap your app and provide global state for errors
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

