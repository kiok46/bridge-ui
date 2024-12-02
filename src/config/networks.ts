export const SUPPORTED_NETWORKS = {
  sepolia: {
    chainId: '11155111',
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    contracts: {
      USDT: '0x...' // Your contract addresses
    }
  }
};

export const DEFAULT_NETWORK = 'sepolia'; 