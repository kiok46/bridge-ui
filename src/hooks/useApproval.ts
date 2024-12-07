import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { TOKEN_ABI } from '../contracts/abis/Token';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { TokenConfig } from '../types/tokens';
export const useApproval = (selectedToken: TokenConfig, address: string) => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTokenContract = useCallback(async () => {
    if (!window.ethereum || !address) return null;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(
        selectedToken.address,
        TOKEN_ABI,
        signer
      );
    } catch (error) {
      console.error('Error getting USDT contract:', error);
      return null;
    }
  }, [selectedToken.address, address]);

  const checkAllowance = useCallback(async () => {
    try {
      const contract = await getTokenContract();
      if (!contract || !address) return '0';

      const allowance = await contract.allowance(
        address,
        SUPPORTED_NETWORKS[selectedToken.chainId].bridgeAddress
      );
      return ethers.formatUnits(allowance, 6); // USDT uses 6 decimals
    } catch (error) {
      console.error('Error checking allowance:', error);
      return '0';
    }
  }, [getTokenContract, address, selectedToken.chainId]);

  const approve = useCallback(async (amount: string) => {
    setIsApproving(true);
    setError(null);
    
    try {
      const contract = await getTokenContract();
      if (!contract) throw new Error('Failed to get USDT contract');

      const amountInWei = ethers.parseUnits(amount, 6);
      const tx = await contract.approve(
        SUPPORTED_NETWORKS[selectedToken.chainId].bridgeAddress,
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
  }, [getTokenContract, selectedToken.chainId]);

  return { 
    checkAllowance, 
    approve, 
    isApproving, 
    error 
  };
}; 