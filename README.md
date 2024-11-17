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

# TRON DApp Example with React

## Project Setup

### 1. Create React App
Start by creating a new React app if you haven't already:

```
npx create-react-app tron-dapp
cd tron-dapp
```
### 2. Install Dependencies
You'll need the TronWeb library to interact with the TRON network. Install it using npm:

```
npm install tronweb
```

### 3. App File Structure
The file structure of the app will be:

```
tron-dapp/
├── src/
│   ├── components/
│   │   └── WalletConnect.js
│   ├── App.js
│   ├── index.js
└── package.json
```
### 1. Create WalletConnect.js Component
This component will manage wallet connection (TronLink detection) and transaction signing.

```
// src/components/WalletConnect.js
import React, { useEffect, useState } from 'react';
import TronWeb from 'tronweb';

const WalletConnect = () => {
  const [tronWeb, setTronWeb] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    // Detect TronLink wallet
    const initializeTronLink = async () => {
      if (window.tronLink && window.tronLink.ready) {
        const tronLinkWeb = window.tronLink.tronWeb;

        if (tronLinkWeb && tronLinkWeb.defaultAddress.base58) {
          setTronWeb(tronLinkWeb);
          setAccount(tronLinkWeb.defaultAddress.base58);
        } else {
          console.error('TronLink is not initialized.');
        }
      } else {
        console.log('TronLink is not available.');
      }
    };

    initializeTronLink();
  }, []);

  // Send transaction
  const sendTransaction = async () => {
    if (!tronWeb || !account) {
      console.error('TronWeb or Account is not available');
      return;
    }

    const transaction = await tronWeb.transactionBuilder.sendTrx(
      'TLaTx1Wm4hpFnk8fFQz4zcnmqcmv4dRz7p', // Destination address (change to your recipient)
      1000000, // Amount (in SUN, 1 TRX = 1,000,000 SUN)
      account // Sender's address
    );

    try {
      const signedTx = await tronWeb.trx.sign(transaction);
      const result = await tronWeb.trx.sendRawTransaction(signedTx);
      setTransactionStatus(result);
      alert('Transaction successful!');
    } catch (error) {
      console.error('Error while sending transaction:', error);
      setTransactionStatus('Error while sending transaction');
    }
  };

  return (
    <div>
      <h2>TRON DApp Example</h2>
      {!account ? (
        <p>Waiting for TronLink wallet...</p>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={sendTransaction}>Send Transaction</button>
          {transactionStatus && <p>Status: {transactionStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
```

### 2. Modify App.js to Include WalletConnect
In your App.js file, you can render the WalletConnect component.

```
// src/App.js
import React from 'react';
import WalletConnect from './components/WalletConnect';

const App = () => {
  return (
    <div>
      <WalletConnect />
    </div>
  );
};

export default App;
```

### 3. Update index.js to Render the Application
Ensure the app is rendered in index.js:

```
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
```

### 4. Run the Application
Once the code is ready, you can run the application locally with:

```
npm start
```

This will launch the React app, and you should see a simple UI with a "Connect Wallet" message (when TronLink is not available) or the connected wallet's address and a button to send a simple transaction.

### How the Application Works
#### Wallet Detection
The app first checks if TronLink is installed. If found, it initializes TronWeb with the account from TronLink. If no wallet is found, it will prompt the user accordingly.

#### Account Info
It will display the connected account's address.

#### Sending Transactions
The user can press the "Send Transaction" button, which will initiate a simple transaction sending 1 TRX (in SUN, which is the smallest unit of TRX) to a hardcoded address. You can change the recipient address as needed.

#### Transaction Signing
The app signs the transaction using TronLink's private key, which is never exposed to your frontend code. The signed transaction is sent to the TRON network.

#### Transaction Result
The status of the transaction is displayed (either successful or failed).

#### Additional Features You Can Add
Network Switching: Check if the connected wallet is on the right network (Testnet or Mainnet) and provide a UI to switch networks.
Error Handling: Gracefully handle errors such as insufficient balance, network issues, or rejected transactions.
Loading Spinner: Add a loading spinner while the transaction is being processed.
### Summary
This simple React app connects to TronLink, allows a user to send a basic transaction, and signs it using TronLink’s private key securely. This approach ensures that no private key is ever exposed to your application, and the transaction is signed directly in the TronLink wallet.

This example can be expanded further to interact with TRC-20 tokens or interact with smart contracts deployed on TRON.

# Integrating Nile Testnet Support in tron-reactjs

To integrate support for the TRON Nile Testnet into the `tron-reactjs` project, we need to make a few adjustments to your configuration and setup to ensure a smooth developer experience. The Nile Testnet provides a testing environment with similar functionality to the mainnet, allowing developers to build and test decentralized applications (dApps) without incurring real-world costs.

## Step-by-Step Plan

### 1. Update Configuration for Nile Testnet
Update the `tronweb` initialization settings to use the Nile Testnet endpoints:
```javascript
import TronWeb from 'tronweb';

const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io',
  privateKey: 'YOUR_PRIVATE_KEY' // use a private key suitable for testing
});
```
### 2. Ensure Wallet Compatibility
Test compatibility with wallets like TronLink configured for the Nile Testnet. Ensure developers know how to switch their TronLink to the Nile Testnet within the extension or mobile app.

### 3. Use TRONGrid for API Access
Utilize TRONGrid endpoints specifically for Nile:

```
FullNode HTTP API: https://nile.trongrid.io
SolidityNode HTTP API: https://nile.trongrid.io
Event Server: https://nile.trongrid.io
These endpoints mirror mainnet functionality and provide reliable access for testing.
```

### 4. Add Support for Test Tokens
Enable developers to request TRX and other test tokens using the Nile Testnet faucet:
```
Faucet URL: TRON Nile Testnet Faucet
```

### 5. Set Up Sample Contracts
Deploy sample contracts to Nile using tools like TronBox or TronIDE and provide example scripts for contract deployment and interaction. This can include:

[sample Tron smart contracts] (https://github.com/michaldrozd/tron-smart-contracts)

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


