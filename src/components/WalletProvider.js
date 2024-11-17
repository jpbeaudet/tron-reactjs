import React, { useState, useEffect, useContext } from 'react';
import { TronContext } from '../TronReactProvider';

const WalletProvider = ({ children }) => {
  const { tronWeb, setWallet } = useContext(TronContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          setWallet(window.tronWeb.defaultAddress.base58);
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWallet();
  }, [tronWeb, setWallet]);

  if (loading) {
    return <p>Loading TronLink Wallet...</p>;
  }

  return children;
};

export default WalletProvider;
