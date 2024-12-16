import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { TOKEN_ABI } from '../contracts/abis/Token';
import { SUPPORTED_CHAINS } from '../config/chains';
import { TokenConfig } from '../types/tokens';

export const useApproval = (selectedToken: TokenConfig | undefined, address: string) => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTokenContract = useCallback(async () => {
    if (!window.ethereum || !address || !selectedToken) return null;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(
        selectedToken.address,
        TOKEN_ABI,
        signer
      );
    } catch (error) {
      console.error('Error getting token contract:', error);
      return null;
    }
  }, [selectedToken?.address, address]);

  const checkAllowance = useCallback(async () => {
    if (!selectedToken) return '0';
    
    try {
      const contract = await getTokenContract();
      if (!contract || !address) return '0';

      const allowance = await contract.allowance(
        address,
        SUPPORTED_CHAINS.find(chain => chain.id === selectedToken.chainId)?.bridgeAddress
      );
      return ethers.formatUnits(allowance, selectedToken.decimals);
    } catch (error) {
      console.error('Error checking allowance:', error);
      return '0';
    }
  }, [getTokenContract, address, selectedToken]);

  const approve = useCallback(async (amount: string) => {
    if (!selectedToken) {
      throw new Error('No token selected');
    }

    setIsApproving(true);
    setError(null);
    
    try {
      const contract = await getTokenContract();
      if (!contract) throw new Error('Failed to get token contract');

      const amountInWei = ethers.parseUnits(amount, selectedToken.decimals);
      const tx = await contract.approve(
        SUPPORTED_CHAINS.find(chain => chain.id === selectedToken.chainId)?.bridgeAddress,
        amountInWei
      );
      await tx.wait();
    } catch (error) {
      console.error('Error approving token:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      throw error;
    } finally {
      setIsApproving(false);
    }
  }, [getTokenContract, selectedToken]);

  return { 
    checkAllowance, 
    approve, 
    isApproving, 
    error 
  };
};