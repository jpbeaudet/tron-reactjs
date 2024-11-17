import { useState, useEffect } from 'react';
import TronWeb from 'tronweb';

/**
 * Custom hook to subscribe to any smart contract event.
 * @param {string} contractAddress - The address of the smart contract to listen to.
 * @param {string} eventName - The name of the event (e.g., 'Transfer'). Use '*' for all events.
 * @param {function} callback - The callback function that handles the event data.
 */
export function useContractEvent(contractAddress, eventName = '*', callback) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Initialize TronWeb instance
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      console.error('TronWeb is not initialized');
      return;
    }

    // Fetch contract instance
    const contract = tronWeb.contract().at(contractAddress);

    const handleEvent = (err, result) => {
      if (err) {
        console.error('Error watching event:', err);
        return;
      }
      console.log(`Event ${eventName} received:`, result);
      callback(result); // Trigger the callback with event data
    };

    // Subscribe to all events if '*' is provided
    if (eventName === '*') {
      contract.allEvents().watch(handleEvent);
    } else {
      // Subscribe to a specific event
      contract[eventName]().watch(handleEvent);
    }

    setIsSubscribed(true);

    // Cleanup on unmount to avoid memory leaks
    return () => {
      contract[eventName]().stop(); // Stop listening to the event
      setIsSubscribed(false);
    };
  }, [contractAddress, eventName, callback]);

  return isSubscribed;
}
