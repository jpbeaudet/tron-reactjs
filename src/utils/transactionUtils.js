// utils/transactionUtils.js
export const trackTransaction = (tronWeb, txID) => {
  return tronWeb.trx.getTransactionInfo(txID)
    .then((result) => {
      if (result.result === 'SUCCESS') {
        return 'Transaction Confirmed';
      } else if (result.result === 'FAILED') {
        return 'Transaction Failed';
      } else {
        return 'Transaction Pending';
      }
    })
    .catch((error) => {
      console.error('Error tracking transaction:', error);
      return 'Error Tracking Transaction';
    });
};
