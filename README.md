# tron-reactjs

A React library for interacting with the Tron blockchain, designed to provide a seamless developer experience with features similar to MetaMask. This library integrates TronLink wallet detection, smart contract interaction, event listening, and utility functions, simplifying Tron-based dApp development.

---

## Features

- **Wallet Integration**: Easily connect and interact with TronLink wallet.
- **Smart Contract Support**: Initialize and interact with Tron smart contracts.
- **Event Listening**: Listen to smart contract events in real-time.
- **Utility Functions**: Helpful tools for Tron token and address management.
- **Inspired by MetaMask UX**: Provides a user-friendly experience for Tron-based applications.

---

## Installation

Install the library using npm:

```
npm install tron-reactjs
```

## Quickstart
1. Wrap Your App with TronReactProvider
The TronReactProvider initializes TronWeb and provides wallet context to your app.

```
import React from 'react';
import { TronReactProvider } from 'tron-reactjs';

const App = () => (
  <TronReactProvider>
    <YourDApp />
  </TronReactProvider>
);

export default App;
```
## Connect and Use Wallet
Use the useWallet hook to access the connected wallet and TronWeb instance.

```
import React from 'react';
import { useWallet } from 'tron-reactjs';

const WalletInfo = () => {
  const { tronWeb, wallet, isConnected } = useWallet();

  if (!isConnected) return <p>Please connect your TronLink wallet.</p>;

  return (
    <div>
      <p>Wallet Address: {wallet}</p>
      <p>TronWeb Instance: {tronWeb ? 'Initialized' : 'Not Initialized'}</p>
    </div>
  );
};

export default WalletInfo;
```

## Interact with Smart Contracts
Use the useContract hook to interact with Tron smart contracts.

```
import React from 'react';
import { useContract } from 'tron-reactjs';

const abi = [
  {
    "inputs": [],
    "name": "getValue",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];
const address = 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const ContractInfo = () => {
  const contract = useContract(abi, address);

  const fetchValue = async () => {
    if (!contract) return;
    const value = await contract.getValue().call();
    console.log('Contract Value:', value);
  };

  return <button onClick={fetchValue}>Fetch Contract Value</button>;
};

export default ContractInfo;
```

## Listen to Contract Events
Use the useEvents hook to listen to smart contract events.

```
import React from 'react';
import { useEvents } from 'tron-reactjs';

const abi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "name": "value", "type": "uint256" }
    ],
    "name": "ValueUpdated",
    "type": "event"
  }
];
const address = 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const eventName = 'ValueUpdated';

const EventListener = () => {
  const events = useEvents(abi, address, eventName);

  return (
    <div>
      <h3>Events:</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>New Value: {event.returnValues.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventListener;
```

## Utility Functions
The tronUtils module provides common utilities for Tron development.

```
import { tronUtils } from 'tron-reactjs';

const trxToSun = tronUtils.toSun(10); // Convert 10 TRX to Sun
const isValid = tronUtils.isAddressValid('TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', tronWeb); // Validate address
```

## Full Example

```
import React from 'react';
import { TronReactProvider, useWallet, useContract, useEvents } from 'tron-reactjs';

const App = () => {
  const { wallet, isConnected } = useWallet();
  const contract = useContract(abi, address);
  const events = useEvents(abi, address, 'ValueUpdated');

  const fetchValue = async () => {
    if (!contract) return;
    const value = await contract.getValue().call();
    console.log('Contract Value:', value);
  };

  if (!isConnected) return <p>Please connect your TronLink wallet.</p>;

  return (
    <div>
      <h1>Welcome to Tron dApp</h1>
      <p>Connected Wallet: {wallet}</p>
      <button onClick={fetchValue}>Fetch Contract Value</button>
      <h3>Events:</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>New Value: {event.returnValues.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default () => (
  <TronReactProvider>
    <App />
  </TronReactProvider>
);
```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


