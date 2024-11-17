import React, { createContext, useContext, useState, useEffect } from 'react';
import TronWeb from 'tronweb';

// Default settings for TronWeb in case TronLink is not available
const defaultTronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: 'YOUR_PRIVATE_KEY'  // Remove this for production environments
});

// Create a context for TronWeb
const TronWebContext = createContext(defaultTronWeb);

export const WalletProvider = ({ children }) => {
  const [tronWeb, setTronWeb] = useState(defaultTronWeb);

  useEffect(() => {
    const checkTronLink = async () => {
      // Check if TronLink is available
      if (window.tronLink && window.tronLink.ready) {
        console.log('TronLink detected');
        
        const tronLinkWeb = window.tronLink.tronWeb;
        
        // Check if TronLink is initialized
        if (tronLinkWeb && tronLinkWeb.defaultAddress.base58) {
          setTronWeb(tronLinkWeb);
        } else {
          console.error('TronLink is not initialized');
        }
      } else {
        console.log('TronLink is not detected, using fallback TronWeb instance');
        setTronWeb(defaultTronWeb);
      }
    };

    checkTronLink();
  }, []);

  return (
    <TronWebContext.Provider value={tronWeb}>
      {children}
    </TronWebContext.Provider>
  );
};

// Custom hook to access TronWeb
export const useTronWeb = () => {
  return useContext(TronWebContext);
};
