// utils/walletDetection.js
export const detectWallet = () => {
  if (window.tronLink) {
    return 'TronLink';
  } else if (window.tronWeb && window.tronWeb.defaultAddress) {
    return 'Math Wallet';
  } else if (window.ethereum && window.ethereum.isTrust) {
    return 'Trust Wallet';
  } else {
    return 'No compatible wallet detected';
  }
};
