import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { TokenConfig } from '../types/tokens';

export const useTokenBalance = (selectedToken: TokenConfig) => {
  const [tokenBalance, setTokenBalance] = useState('0');

  const fetchtokenBalance = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tokenAbi = ["function balanceOf(address account) public view returns (uint256)"];
      const tokenContract = new ethers.Contract(
        selectedToken.address, 
        tokenAbi, 
        signer
      );
      
      const balance = await tokenContract.balanceOf(SUPPORTED_NETWORKS[selectedToken.chainId].bridgeAddress);
      setTokenBalance(ethers.formatUnits(balance, selectedToken.decimals));
    } catch (error) {
      console.error('Error fetching token balance:', error);
      alert('Error fetching token balance: ' + error.message);
    }
  };

  useEffect(() => {
    fetchtokenBalance();
  }, []);

  return tokenBalance;
}; 