import { useEffect, useState } from 'react';
import { useTronWeb } from '../components/WalletProvider';

export const useWallet = () => {
  const tronWeb = useTronWeb();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkAccount = async () => {
      if (tronWeb && tronWeb.defaultAddress.base58) {
        setAccount(tronWeb.defaultAddress.base58);
      }
    };

    checkAccount();
  }, [tronWeb]);

  // Function to request the user to sign a transaction
  const sendTransaction = async (transaction) => {
    if (!tronWeb) {
      console.error('TronWeb is not initialized');
      return;
    }

    try {
      const signedTransaction = await tronWeb.transactionBuilder.sign(transaction);
      const broadcastResult = await tronWeb.trx.sendRawTransaction(signedTransaction);
      return broadcastResult;
    } catch (error) {
      console.error('Transaction signing failed:', error);
    }
  };

  return {
    account,
    sendTransaction,
  };
};
