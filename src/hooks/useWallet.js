import { useContext } from 'react';
import { TronContext } from '../TronReactProvider';

const useWallet = () => {
  const { tronWeb, wallet, isConnected } = useContext(TronContext);

  const sendTRX = async (to, amount) => {
    if (!tronWeb || !wallet) throw new Error('Wallet not connected.');

    try {
      const transaction = await tronWeb.trx.sendTransaction(to, tronWeb.toSun(amount));
      return transaction;
    } catch (error) {
      console.error('Error sending TRX:', error);
      throw error;
    }
  };

  return { tronWeb, wallet, isConnected, sendTRX };
};

export default useWallet;
