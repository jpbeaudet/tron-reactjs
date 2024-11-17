import { useContext, useEffect, useState } from 'react';
import { TronContext } from '../TronReactProvider';

const useEvents = (abi, address, eventName) => {
  const { tronWeb } = useContext(TronContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let subscription;
    const startListening = async () => {
      if (!tronWeb) return;
      try {
        const contract = await tronWeb.contract(abi, address);
        subscription = contract[eventName]().watch((err, event) => {
          if (err) {
            console.error('Error listening to events:', err);
            return;
          }
          setEvents((prevEvents) => [...prevEvents, event]);
        });
      } catch (error) {
        console.error('Error initializing event listener:', error);
      }
    };

    startListening();

    return () => {
      if (subscription) subscription.stop();
    };
  }, [tronWeb, abi, address, eventName]);

  return events;
};

export default useEvents;
