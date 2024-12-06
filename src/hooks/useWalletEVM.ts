import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { USDT_ABI } from '../contracts/abis/USDT';
import { USDT_ADDRESSES } from '../config/contracts';
import { SUPPORTED_NETWORKS } from '../config/networks';

export const useWalletEVM = () => {
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
    console.log('getProvider', isConnected, address, window.ethereum)
    if (!isConnected || !address || !window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, [isConnected, address]);

  const getUSDTContract = useCallback(async (chainId: string) => {
    const provider = getProvider();
    if (!provider) {
      console.error('Provider not available');
      return null;
    }
    if (!address) {
      console.error('No wallet address available');
      return null;
    }
    if (!USDT_ADDRESSES[chainId]) {
      console.error(`No USDT address configured for chain ID: ${chainId}`);
      return null;
    }
  
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        USDT_ADDRESSES[chainId],
        USDT_ABI,
        signer
      );
      
      // Verify the contract is properly instantiated
      if (!contract.runner) {
        throw new Error('Contract not properly initialized');
      }
      
      return contract;
    } catch (error) {
      console.error('Error getting USDT contract:', error);
      throw new Error(`Failed to get USDT contract: ${error.message}`);
    }
  }, [getProvider, address]);

  const approveUSDT = useCallback(async (chainId: string, amount: string) => {
    try {
      const contract = await getUSDTContract(chainId);
      if (!contract) throw new Error('Failed to get USDT contract');

      const amountInWei = ethers.parseUnits(amount, 6);
      const provider = getProvider();
      if (!provider) throw new Error('Provider not available');

      const signer = await provider.getSigner();
      // @ts-ignore
      const tx = await contract.connect(signer).approve(
        SUPPORTED_NETWORKS[chainId].contracts.BRIDGE,
        amountInWei
      );
      await tx.wait();
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error;
    }
  }, [getUSDTContract, getProvider]);

  const getAllowance = useCallback(async (chainId: string, owner: string, spender: string) => {
    try {
      const contract = await getUSDTContract(chainId);
      if (!contract) throw new Error('Failed to get USDT contract');

      const allowance = await contract.allowance(owner, spender);
      return ethers.formatUnits(allowance, 6);
    } catch (error) {
      console.error('Error getting allowance:', error);
      throw error;
    }
  }, [getUSDTContract]);

  return {
    address,
    network,
    isConnected,
    isInitializing,
    connect,
    disconnect,
    getProvider,
    approveUSDT,
    getAllowance,
  };
}; 