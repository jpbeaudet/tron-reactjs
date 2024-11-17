const toSun = (trx) => trx * 1e6;
const fromSun = (sun) => sun / 1e6;

const isAddressValid = (address, tronWeb) => tronWeb.isAddress(address);

export { toSun, fromSun, isAddressValid };
