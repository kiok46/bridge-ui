export const SUPPORTED_NETWORKS = {
  sepolia: {
    chainId: '11155111',
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    contracts: {
      USDT: '0x0ea37B93D683FcD2BC50c0B365D4619f8bA10108'
    }
  }
};

export const DEFAULT_NETWORK = 'sepolia'; 

export const BRIDGE_ADDRESSES: { [key: string]: string } = {
  sepolia: '0x69fB183C10C546B734aFceC4ca6A5a8c5711b1f9',
}; 