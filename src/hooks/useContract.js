import { useContext, useState } from 'react';
import { TronContext } from '../TronReactProvider';

const useContract = (abi, address) => {
  const { tronWeb } = useContext(TronContext);
  const [contract, setContract] = useState(null);

  const initializeContract = async () => {
    if (!tronWeb) throw new Error('TronWeb not initialized.');

    try {
      const contractInstance = await tronWeb.contract(abi, address);
      setContract(contractInstance);
      return contractInstance;
    } catch (error) {
      console.error('Error initializing contract:', error);
      throw error;
    }
  };

  const callMethod = async (methodName, ...params) => {
    if (!contract) throw new Error('Contract not initialized.');

    try {
      const result = await contract[methodName](...params).call();
      return result;
    } catch (error) {
      console.error(`Error calling method ${methodName}:`, error);
      throw error;
    }
  };

  return { contract, initializeContract, callMethod };
};

export default useContract;
