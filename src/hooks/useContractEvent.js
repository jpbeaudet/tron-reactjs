import { useEffect } from 'react';
import { useEventContext } from '../EventContext';  // Import context

export const useContractEvent = (contractAddress, eventName, callback) => {
  const { state, dispatch } = useEventContext();

  useEffect(() => {
    // Function to subscribe to the event
    const subscribeEvent = async () => {
      // Check if the event is already subscribed globally
      if (state.events[contractAddress] && state.events[contractAddress][eventName]) {
        return;  // Event already subscribed
      }

      try {
        const tronWeb = window.tronLink || window.tronWeb;
        const contract = await tronWeb.contract().at(contractAddress);

        // Subscribe to the event
        contract[eventName]().watch(callback);

        // Store the event subscription in global state
        dispatch({
          type: 'ADD_EVENT',
          payload: { contractAddress, eventName, callback },
        });
      } catch (error) {
        console.error('Error subscribing to contract event:', error);
      }
    };

    subscribeEvent();

    // Cleanup: Unsubscribe from the event when the component unmounts
    return () => {
      if (state.events[contractAddress] && state.events[contractAddress][eventName]) {
        dispatch({
          type: 'REMOVE_EVENT',
          payload: { contractAddress, eventName },
        });
      }
    };
  }, [contractAddress, eventName, callback, dispatch, state]);
};
