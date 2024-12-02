import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getUSDTContract } from '../services/contracts';

export const useUSDTBalance = (address?: string, chainId?: string) => {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!window.ethereum || !address || !chainId) {
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = await getUSDTContract(chainId, provider);
        const balance = await contract.balanceOf(address);
        setBalance(ethers.formatUnits(balance, 6));
      } catch (err: any) {
        console.error('Error fetching USDT balance:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address, chainId]);

  return { balance, loading, error };
}; 