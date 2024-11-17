// components/WalletSwitcher.js
import React, { useState } from 'react';
import { detectWallet } from '../utils/walletDetection';

const WalletSwitcher = ({ wallets = [] }) => {
  const [selectedWallet, setSelectedWallet] = useState(detectWallet());

  const handleWalletSwitch = (walletName) => {
    console.log(`Switching to: ${walletName}`);
    setSelectedWallet(walletName);
    // Add logic to connect to the selected wallet (via TronLink, Math Wallet, etc.)
  };

  return (
    <div>
      <h3>Current Wallet: {selectedWallet}</h3>
      {wallets.length > 0 ? (
        wallets.map(wallet => (
          <button key={wallet} onClick={() => handleWalletSwitch(wallet)}>
            Switch to {wallet}
          </button>
        ))
      ) : (
        <p>No supported wallets available</p>
      )}
    </div>
  );
};

export default WalletSwitcher;
