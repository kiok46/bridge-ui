import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from '../config/chains';
import { TokenConfig } from '../types/tokens';

export const useTokenBalance = (selectedToken: TokenConfig) => {
  const [tokenBalance, setTokenBalance] = useState('0');

  const fetchtokenBalance = async () => {
    if (!selectedToken) return;

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
      
      const balance = await tokenContract.balanceOf(SUPPORTED_CHAINS.find(chain => chain.id === selectedToken.chainId)?.bridgeAddress);
      setTokenBalance(ethers.formatUnits(balance, selectedToken.decimals));
    } catch (error) {
      console.error('Error fetching token balance:', error);
      alert('Error fetching token balance: ' + error.message);
    }
  };

  useEffect(() => {
    if (selectedToken) {
      fetchtokenBalance();
    }
  }, [selectedToken]);

  return tokenBalance;
}; 