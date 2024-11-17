import { useState, useEffect } from 'react';
import TronWeb from 'tronweb';

export const useTron = (options = {}) => {
  const [tronWeb, setTronWeb] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    const initTronWeb = async () => {
      try {
        if (!window.tronWeb) {
          console.warn('TronLink not detected. Please install and unlock TronLink.');
          return;
        }

        const instance = window.tronWeb;
        setTronWeb(instance);

        // Listen for account and network changes
        const checkAccount = () => {
          if (instance.defaultAddress.base58) {
            setAccount(instance.defaultAddress.base58);
            setIsConnected(true);
          } else {
            setAccount(null);
            setIsConnected(false);
          }
        };

        const interval = setInterval(checkAccount, 1000);

        setNetwork(await instance.fullNode.request('/wallet/getnodeinfo'));
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error initializing TronWeb:', error);
      }
    };

    initTronWeb();
  }, []);

  return { tronWeb, account, isConnected, network };
};
