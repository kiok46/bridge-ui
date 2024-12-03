import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useEVMWallet = () => {
  const [userEVMAddress, setUserEVMAddress] = useState('');
  const [network, setNetwork] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        setUserEVMAddress(address);
        setNetwork(network.name);
      } catch (error) {
        if (error.code === -32002) {
          alert('Connection request already pending. Please check your wallet.');
        } else if (error.code === 4001) {
          alert('Connection request rejected by user.');
        } else {
          console.error('Error connecting wallet:', error);
          alert('Error connecting wallet: ' + error.message);
        }
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setUserEVMAddress('');
    setNetwork('');
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          setUserEVMAddress(address);
          setNetwork(network.name);
        } catch (error) {
          // Silently fail if not connected
          console.log('No wallet connected');
        }
      }
    };

    checkConnection();
  }, []);

  return {
    userEVMAddress,
    network,
    connectWallet,
    disconnectWallet
  };
};

const connectBCHWallet = async (): Promise<string> => {
  // This is a mock implementation
  // Replace this with your actual WalletConnect integration
  return new Promise((resolve) => {
    // Simulating a wallet connection
    setTimeout(() => {
      resolve('bitcoincash:qz6shwateymu3jm62sm47r6aw0u2dgrz3u73fpl667');
    }, 500);
  });
};

export const useBCHWallet = () => {
  const [userBCHAddress, setUserBCHAddress] = useState('');

  const handleWalletConnect = useCallback(async () => {
    try {
      const address = await connectBCHWallet();
      setUserBCHAddress(address);
    } catch (error) {
      console.error('Error connecting BCH wallet:', error);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setUserBCHAddress('');
  }, []);

  return {
    userBCHAddress,
    connectWallet: handleWalletConnect,
    disconnectWallet
  };
}; 