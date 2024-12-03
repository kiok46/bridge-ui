import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '../config/networks';

export interface WalletContextValue {
  userEVMAddress: string;
  userBCHAddress: string;
  evmNetwork: string;
  isEVMConnected: boolean;
  isBCHConnected: boolean;
  connectEVM: () => Promise<void>;
  connectBCH: () => Promise<void>;
  disconnectEVM: () => void;
  disconnectBCH: () => void;
  setEVMAddress: (address: string) => void;
  setBCHAddress: (address: string) => void;
}

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEVMAddress, setUserEVMAddress] = useState('');
  const [userBCHAddress, setUserBCHAddress] = useState('');
  const [evmNetwork, setEVMNetwork] = useState('sepolia');
  const [isEVMConnected, setIsEVMConnected] = useState(false);
  const [isBCHConnected, setIsBCHConnected] = useState(false);

  const connectEVM = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const address = accounts[0];
        
        // Get network
        const network = await provider.getNetwork();
        const networkName = SUPPORTED_NETWORKS[network.chainId.toString()]?.name || 'Unknown Network';
        setEVMNetwork(networkName);

        setUserEVMAddress(address);
        setIsEVMConnected(true);
      }
    } catch (error) {
      console.error('Error connecting EVM wallet:', error);
    }
  };

  const connectBCH = async () => {
    // Implement BCH wallet connection logic here
    console.warn('BCH wallet connection not implemented');
  };

  const disconnectEVM = () => {
    setUserEVMAddress('');
    setIsEVMConnected(false);
  };

  const disconnectBCH = () => {
    setUserBCHAddress('');
    setIsBCHConnected(false);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setUserEVMAddress(accounts[0].address);
            setIsEVMConnected(true);

            // Get network
            const network = await provider.getNetwork();
            const networkName = SUPPORTED_NETWORKS[network.chainId.toString()]?.name || 'Unknown Network';
            setEVMNetwork(networkName);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserEVMAddress(accounts[0]);
          setIsEVMConnected(true);
        } else {
          disconnectEVM();
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const networkName = SUPPORTED_NETWORKS[network.chainId.toString()]?.name || 'Unknown Network';
        setEVMNetwork(networkName);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      userEVMAddress,
      userBCHAddress,
      evmNetwork,
      isEVMConnected,
      isBCHConnected,
      connectEVM,
      connectBCH,
      disconnectEVM,
      disconnectBCH,
      setEVMAddress: setUserEVMAddress,
      setBCHAddress: setUserBCHAddress
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextValue => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 