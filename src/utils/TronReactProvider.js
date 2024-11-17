import React, { createContext, useState, useEffect } from 'react';
import TronWeb from 'tronweb';

export const TronContext = createContext();

const TronReactProvider = ({ children, fullHost = 'https://api.trongrid.io' }) => {
  const [tronWeb, setTronWeb] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initTronWeb = async () => {
      const tronInstance = new TronWeb({ fullHost });
      setTronWeb(tronInstance);

      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        tronInstance.setAddress(window.tronWeb.defaultAddress.base58);
        setWallet(window.tronWeb.defaultAddress.base58);
        setIsConnected(true);
      }
    };

    initTronWeb();
  }, [fullHost]);

  return (
    <TronContext.Provider value={{ tronWeb, wallet, isConnected, setWallet }}>
      {children}
    </TronContext.Provider>
  );
};

export default TronReactProvider;
