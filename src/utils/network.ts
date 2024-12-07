import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from '../config/chains';
import { ERROR_MESSAGES } from './constants';

export const switchNetwork = async (networkKey: string): Promise<boolean> => {
  if (!window.ethereum) {
    throw new Error(ERROR_MESSAGES.NO_WALLET);
  }

  const network = SUPPORTED_CHAINS[networkKey];
  if (!network) {
    throw new Error('Unsupported network');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.toQuantity(network.chainId) }],
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ethers.toQuantity(network.chainId),
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        return false;
      }
    }
    console.error('Error switching network:', error);
    return false;
  }
}; 