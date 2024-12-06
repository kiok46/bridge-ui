import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from './config/networks';

export const useUSDTBalance = (selectedChain: string) => {
  const [usdtBalance, setUsdtBalance] = useState('0');

  const fetchUSDTBalance = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAbi = ["function balanceOf(address account) public view returns (uint256)"];
      const tokenContract = new ethers.Contract(SUPPORTED_NETWORKS[selectedChain].contracts.USDT, tokenAbi, signer);
      
      const balance = await tokenContract.balanceOf(SUPPORTED_NETWORKS[selectedChain].contracts.BRIDGE);
      setUsdtBalance(ethers.formatUnits(balance, 6));
    } catch (error) {
      console.error('Error fetching USDT balance:', error);
      alert('Error fetching USDT balance: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUSDTBalance();
  }, []);

  return usdtBalance;
};
