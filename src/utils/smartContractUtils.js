// utils/smartContractUtils.js
export const listenForEvents = (tronWeb, contractAddress, eventName) => {
  const contract = tronWeb.contract().at(contractAddress);
  contract[eventName]().watch((err, event) => {
    if (err) {
      console.error(`Error listening for ${eventName} event:`, err);
      return;
    }
    console.log(`${eventName} Event Detected:`, event);
  });
};
