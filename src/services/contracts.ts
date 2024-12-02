import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '../config/networks';

export const getUSDTContract = async (chainId: string, provider: ethers.Provider) => {
  const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId);
  if (!network) throw new Error('Unsupported network');
  
  // Add your contract ABI and implementation here
  return new ethers.Contract(network.contracts.USDT, [], provider);
}; 