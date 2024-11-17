import React, { createContext, useContext, useReducer } from 'react';

// Create the context for managing events globally
const EventContext = createContext();

const initialState = {
  events: {},
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.contractAddress]: {
            ...state.events[action.payload.contractAddress],
            [action.payload.eventName]: action.payload.callback,
          },
        },
      };
    case 'REMOVE_EVENT':
      const updatedEvents = { ...state.events };
      delete updatedEvents[action.payload.contractAddress][action.payload.eventName];
      return { ...state, events: updatedEvents };
    default:
      return state;
  }
};

// EventProvider to wrap your app and provide the context
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to access the event context
export const useEventContext = () => useContext(EventContext);
