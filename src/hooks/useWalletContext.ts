import { useContext } from 'react';
import { WalletContext, WalletContextValue } from '../contexts/WalletContext';

export const useWalletContext = (): WalletContextValue | {
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
} => {
  const context = useContext(WalletContext);
  if (!context) {
    // Return a dummy implementation instead of throwing
    return {
      userEVMAddress: '',
      userBCHAddress: '',
      evmNetwork: '',
      isEVMConnected: false,
      isBCHConnected: false,
      connectEVM: async () => {
        console.warn('WalletContext not found, connectEVM action ignored');
      },
      connectBCH: async () => {
        console.warn('WalletContext not found, connectBCH action ignored');
      },
      disconnectEVM: () => {
        console.warn('WalletContext not found, disconnectEVM action ignored');
      },
      disconnectBCH: () => {
        console.warn('WalletContext not found, disconnectBCH action ignored');
      },
      setEVMAddress: () => {
        console.warn('WalletContext not found, setEVMAddress action ignored');
      },
      setBCHAddress: () => {
        console.warn('WalletContext not found, setBCHAddress action ignored');
      }
    };
  }
  return context;
}; 