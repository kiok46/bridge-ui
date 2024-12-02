export const BRIDGE_CONTRACT_ADDRESS = '0x69fB183C10C546B734aFceC4ca6A5a8c5711b1f9'; // Your bridge contract address
export const USDT_DECIMALS = 6;
export const MIN_AMOUNT = '0.1';
export const MAX_AMOUNT = '10000';
export const GAS_LIMIT = 200000;

export const ERROR_MESSAGES = {
  NO_WALLET: 'Please install MetaMask!',
  CONNECT_FAILED: 'Failed to connect wallet',
  APPROVAL_FAILED: 'Failed to approve tokens',
  DEPOSIT_FAILED: 'Failed to deposit tokens',
  WITHDRAW_FAILED: 'Failed to withdraw tokens',
  INVALID_AMOUNT: 'Invalid amount',
  NETWORK_ERROR: 'Network error',
};

export const SUCCESS_MESSAGES = {
  APPROVAL_SUCCESS: 'Successfully approved tokens',
  DEPOSIT_SUCCESS: 'Successfully deposited tokens',
  WITHDRAW_SUCCESS: 'Successfully withdrawn tokens',
};

export const supportedNetworks = [
  {
    network: 'sepolia',
    usdtAddress: '0x0ea37B93D683FcD2BC50c0B365D4619f8bA10108', // Your USDT contract address on Sepolia
  },
  // Add other networks as needed
]; 