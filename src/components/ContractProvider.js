import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const ContractContext = createContext();

const ContractProvider = ({ tronWeb, abi, address, children }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        const instance = await tronWeb.contract(abi, address);
        setContract(instance);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    if (tronWeb) {
      initContract();
    }
  }, [tronWeb, abi, address]);

  return (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  );
};

ContractProvider.propTypes = {
  tronWeb: PropTypes.object.isRequired,
  abi: PropTypes.array.isRequired,
  address: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ContractProvider;
