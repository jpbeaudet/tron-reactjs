# tron-reactjs

A React library for interacting with the Tron blockchain, designed to provide a seamless developer experience with features similar to MetaMask. This library integrates TronLink wallet detection, smart contract interaction, event listening, and utility functions, simplifying Tron-based dApp development.

---

## Features

The `tron-reactjs` library provides a set of utilities and hooks to interact with the Tron network in React-based DApps. It simplifies wallet integration, transaction handling, smart contract interaction, and event monitoring. The key features include:

### 1. Wallet and Network Support
- **TronLink Wallet Integration**: Seamless integration with the TronLink wallet for managing Tron accounts and sending transactions.
- **Multiple Wallet Support**: Enhanced support for multiple wallets like TronMask, Math Wallet, and Trust Wallet. Developers can integrate and switch between these wallets within the app for broader user accessibility.
- **Network Switching**: Automatically handles network switching between Mainnet and Testnet. Users can seamlessly switch between environments for development and production use.

### 2. Transaction Handling
- **Transaction Signing and Sending**: Support for signing and sending transactions with TronLink and other supported wallets.
- **Transaction Monitoring**: Built-in support for monitoring transaction status, including real-time updates, confirmations, and rejections.
- **Error Handling for Transactions**: Catch and handle transaction errors, including transaction reverts. Error messages are provided, including reasons for transaction failures (e.g., insufficient funds or failed contract conditions).

### 3. Smart Contract Event Subscription
- **Event Subscription**: Easily subscribe to smart contract events such as transfers or function calls. Developers can listen for specific events emitted by the contract, such as TRC-20 token transfers.
- **Event Error Handling**: Handles errors that occur during contract event subscriptions. If event listening fails (e.g., incorrect event name or network issues), the hook will return an error that can be displayed to the user.
- **Generic Event Handling**: Use a utility hook (`useSmartContractEvents`) to listen to any events from any smart contract, with dynamic contract addresses and event names.

### 4. Global Error Handling (Error Context)
- **Centralized Error Management**: Use the `ErrorContext` to globally manage and handle errors related to transactions, contract interactions, and event subscriptions.
- **Consistent Error Display**: Display error messages in a user-friendly manner across the application. Errors are captured from both transactions and contract events, and they can be centrally accessed from any component.
- **Custom Error Messages**: Developers can customize error messages based on revert reasons or specific contract errors, providing more informative and actionable feedback to users.

### 5. Customizable Smart Contract Interaction
- **Custom Contract Methods**: Easily interact with any smart contract by specifying the method name and arguments. The library abstracts the complexity of calling smart contract methods.
- **Gas Fees and Customization**: Offers the ability to customize transaction parameters, such as gas fees, delays, and transaction timeouts. This provides more control over the contract interaction.

### 6. Global State Management (Optional)
- **React Context for Event Subscriptions**: Manage multiple event subscriptions globally within your app using React Context. This allows developers to subscribe to events from various contracts in one central place and access them throughout the application.
- **Efficient Subscription Handling**: Automatically manage event listeners, including subscription and unsubscription, based on component lifecycle. This prevents memory leaks and unnecessary network traffic.

### 7. Error Handling in Contract Events and Transactions
- **Transaction Reverts**: The library catches errors from reverted transactions, providing detailed error messages and reasons for failure (e.g., revert reasons from the smart contract).
- **Event Subscription Failures**: Handles subscription errors, including network or event name issues. Errors are tracked and can be displayed or logged for debugging.

---

By integrating these features, developers can easily build Tron-based decentralized applications (dApps) that handle transactions, events, errors, and wallet integration in a streamlined manner. Whether you're building on Testnet or Mainnet, this toolkit simplifies the complex tasks of interacting with smart contracts and managing blockchain-related activities.

---

## Installation

Install the library using npm:

```bash
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

## Error Handling

The `useSmartContract` hook provides a simple and effective way to handle errors, including transaction reverts and general errors from interacting with smart contracts.

### Transaction Revert Handling

When interacting with smart contracts (such as sending transactions), there is always the possibility that a transaction may fail and revert. For example, a transaction could revert if the conditions in the contract are not met (like insufficient balance, failed validation, etc.). 

In these cases, the `useSmartContract` hook catches these errors and provides a detailed message, which can be displayed to users. Specifically, we check for error messages that include the word `"revert"` and extract useful information about the failure.

**Example**:

```
const { sendTransaction, error } = useSmartContract(contractAddress, contractABI);

const handleTransaction = async () => {
  try {
    await sendTransaction('transfer', recipient, amount);
  } catch (error) {
    console.error('Transaction failed:', error.message);
  }
};
```
When an error occurs (such as a transaction revert), the error state will contain a description of the failure, which can be shown in your UI.

### Contract Event Errors
The useSmartContract hook also helps you subscribe to contract events. If an event emits an error, it will be captured and returned by the hook. The error state can be used to display the error message related to event subscription issues.

Example:

```
const { subscribeToEvent, error } = useSmartContract(contractAddress, contractABI);

useEffect(() => {
  subscribeToEvent('Transfer');
}, []);

if (error) {
  console.error('Event subscription failed:', error.message);
}
```
### Global Error Management
Errors are managed globally using the ErrorContext and ErrorProvider. This allows you to handle errors in a centralized way and display them across your app.

Example of using ErrorContext:

```
import { useErrorContext } from './useErrorContext';

const MyComponent = () => {
  const { error } = useErrorContext();
  
  return (
    <div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};
```
By using this approach, your application will have a consistent error handling system that can display errors related to both transactions and contract events in a user-friendly way.

### Custom Error Messages
The error handling system can be further customized to include specific error messages based on the contract’s logic or revert reasons. This allows developers to provide more informative and specific error messages to users, improving the overall user experience.

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

# Event Subscription and Global State Management
## Event Subscription
This library allows you to easily subscribe to blockchain events from your smart contract using the useContractEvent hook. You can listen to any events emitted by your smart contract, such as token transfers, contract interactions, and more. The hook allows you to subscribe to events dynamically, update your state, and trigger re-renders when necessary.

Example:

```
import { useContractEvent } from 'tron-reactjs';

const YourComponent = () => {
  const contract = // instantiate your contract here;
  
  useContractEvent(contract, 'Transfer', (event) => {
    console.log('Transfer event triggered:', event);
  });

  return <div>Listening for Transfer events</div>;
};
```
## Event Unsubscription
To ensure that your application does not run into performance issues or memory leaks, it is crucial to unsubscribe from events when they are no longer needed. In this library, unsubscription is handled automatically when the component is unmounted, but you can also manually unsubscribe using the provided cleanup functionality.

Automatic Cleanup Example:
```
useEffect(() => {
  const unsubscribe = contract.events.Transfer().on('data', handleEvent);

  return () => {
    unsubscribe();
  };
}, [contract]);
```
In the above example, unsubscribe() will be called when the component is unmounted, preventing unnecessary event listeners from being kept alive.

## Global State Management with React Context
For applications that need to manage the state of multiple event subscriptions across different components, this library integrates with React’s Context API to provide a global state. This ensures that event data can be shared across components without needing to pass props down manually.

### Setting up the Event Context:
Create the context:
```
import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const useEventContext = () => {
  return useContext(EventContext);
};
```
### Create the provider:
```
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState({}); // Stores event data globally

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};
```
### Using the context in your components:
```
import { useEventContext } from 'tron-reactjs';

const YourComponent = () => {
  const { events, setEvents } = useEventContext();

  // Subscribe to events and update global state
  useContractEvent(contract, 'Transfer', (event) => {
    setEvents(prev => ({ ...prev, transferEvent: event }));
  });

  return <div>Transfer Event Data: {JSON.stringify(events.transferEvent)}</div>;
};
```
### Benefits of Global State Management:
Single Source of Truth: All event data is centralized in the EventContext, ensuring consistency across your application.
Scalability: As your app grows, you can manage multiple event subscriptions in one place, improving maintainability.
Performance: Avoid unnecessary prop drilling by using global state, and subscribe to events at a higher level in the component tree.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.


