import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { USDT_ABI } from '../contracts/abis/USDT';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { USDT_ADDRESSES } from '../config/contracts';

export const useApproval = (selectedChain: string, address: string) => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUSDTContract = useCallback(async () => {
    if (!window.ethereum || !address) return null;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(
        USDT_ADDRESSES[selectedChain],
        USDT_ABI,
        signer
      );
    } catch (error) {
      console.error('Error getting USDT contract:', error);
      return null;
    }
  }, [selectedChain, address]);

  const checkAllowance = useCallback(async () => {
    try {
      const contract = await getUSDTContract();
      if (!contract || !address) return '0';

      const allowance = await contract.allowance(
        address,
        SUPPORTED_NETWORKS[selectedChain].contracts.BRIDGE
      );
      return ethers.formatUnits(allowance, 6); // USDT uses 6 decimals
    } catch (error) {
      console.error('Error checking allowance:', error);
      return '0';
    }
  }, [getUSDTContract, address, selectedChain]);

  const approve = useCallback(async (amount: string) => {
    setIsApproving(true);
    setError(null);
    
    try {
      const contract = await getUSDTContract();
      if (!contract) throw new Error('Failed to get USDT contract');

      const amountInWei = ethers.parseUnits(amount, 6);
      const tx = await contract.approve(
        SUPPORTED_NETWORKS[selectedChain].contracts.BRIDGE,
        amountInWei
      );
      await tx.wait();
    } catch (error) {
      console.error('Error approving USDT:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      throw error;
    } finally {
      setIsApproving(false);
    }
  }, [getUSDTContract, selectedChain]);

  return { 
    checkAllowance, 
    approve, 
    isApproving, 
    error 
  };
}; 