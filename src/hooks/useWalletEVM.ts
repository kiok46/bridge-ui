import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { TOKEN_ABI } from '../contracts/abis/Token';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { TokenConfig } from '../types/tokens';

export const useWalletEVM = (selectedToken: TokenConfig) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          setAddress(address);
          setNetwork(network.name);
          setIsConnected(true);
        } catch (error) {
          // Silently fail if not connected
          console.log('No wallet connected');
        }
      }
    };

    checkConnection();
  }, []);

  const connect = useCallback(async () => {
    setIsInitializing(true);
    
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      setIsInitializing(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setAddress(address);
      setNetwork(network.name);
      setIsConnected(true);
      
      return address;
    } catch (error) {
      if (error.code === -32002) {
        alert('Connection request already pending. Please check your wallet.');
      } else if (error.code === 4001) {
        alert('Connection request rejected by user.');
      } else {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + error.message);
      }
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setAddress(null);
    setNetwork(null);
    setIsConnected(false);
  }, []);

  const getProvider = useCallback(() => {
    if (!isConnected || !address || !window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, [isConnected, address]);

  const getTokenContract = useCallback(async (tokenAddress: string) => {
    const provider = getProvider();
    if (!provider) {
      console.error('Provider not available');
      return null;
    }
    if (!address) {
      console.error('No wallet address available');
      return null;
    }
    if (!tokenAddress) {
      console.error(`No token address configured for chain ID: ${tokenAddress}`);
      return null;
    }
  
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        tokenAddress,
        TOKEN_ABI,
        signer
      );
      
      // Verify the contract is properly instantiated
      if (!contract.runner) {
        console.error('Contract not properly initialized');
      }
      
      return contract;
    } catch (error) {
      console.error('Error getting token contract:', error);
    }
  }, [getProvider, address]);

  const approveToken = useCallback(async (amount: string) => {
    try {
      const contract = await getTokenContract(selectedToken.address);
      if (!contract) throw new Error('Failed to get token contract');

      const amountInWei = ethers.parseUnits(amount, 6);
      const provider = getProvider();
      if (!provider) throw new Error('Provider not available');

      const signer = await provider.getSigner();
      // @ts-ignore
      const tx = await contract.connect(signer).approve(
        SUPPORTED_NETWORKS[selectedToken.chainId].bridgeAddress,
        amountInWei
      );
      await tx.wait();
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error;
    }
  }, [getTokenContract, getProvider]);

  const getAllowance = useCallback(async (address: string, spender: string) => {
    try {
      const contract = await getTokenContract(selectedToken.address);
      if (!contract) throw new Error('Failed to get token contract');

      const allowance = await contract.allowance(address, spender);
      return ethers.formatUnits(allowance, 6);
    } catch (error) {
      console.error('Error getting allowance:', error);
      throw error;
    }
  }, [getTokenContract]);

  return {
    address,
    network,
    isConnected,
    isInitializing,
    connect,
    disconnect,
    getProvider,
    approveToken,
    getAllowance,
  };
}; 