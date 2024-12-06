import { useState, useCallback, useEffect } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import { ethers } from 'ethers';
import { SessionTypes } from '@walletconnect/types';
import { USDT_ABI } from '../contracts/abis/USDT';
import { USDT_ADDRESSES } from '../config/contracts';
import { SUPPORTED_NETWORKS } from '../config/networks';

const projectId = 'a6add77c2bbd3721384e5a757720b4b2';

const modalConfig = {
  projectId,
  // chains: ['eip155:1', 'eip155:11155111'], // mainnet and sepolia
  chains: ['eip155:1'], // mainnet
  themeMode: 'dark' as const,
};

const wcMetadataEVM = {
  name: 'Token Bridge (EVM)',
  description: 'Token Bridge (EVM)',
  url: 'https://tokenbridge.cash/',
  icons: ['https://tokenbridge.cash/images/logo.png']
};

export const useWalletConnectEVM = () => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [modal, setModal] = useState<WalletConnectModal | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let client: SignClient | null = null;

    const initializeClient = async () => {
      try {
        client = await SignClient.init({
          projectId,
          metadata: wcMetadataEVM
        });
        
        const wcModal = new WalletConnectModal(modalConfig);
        
        setSignClient(client);
        setModal(wcModal);

        // Define event handlers
        const handleSessionDelete = () => {
          console.log('Session deleted');
          setAddress(null);
          setNetwork(null);
          setIsConnected(false);
          setSession(null);
        };

        const handleSessionExpire = () => {
          console.log('Session expired');
          setAddress(null);
          setNetwork(null);
          setIsConnected(false);
          setSession(null);
        };

        // Subscribe to session events
        client.on('session_delete', handleSessionDelete);
        client.on('session_expire', handleSessionExpire);

        // Restore previous session if it exists
        const sessions = client.session.getAll();
        console.log('Available sessions:', sessions);
        
        const lastSession = sessions.at(-1);
        if (lastSession) {
          console.log('Last session:', lastSession);
          console.log('Session expiry:', lastSession.expiry);
          console.log('Current time:', Math.floor(Date.now() / 1000));
          
          if (lastSession.expiry > Math.floor(Date.now() / 1000)) {
            const { namespaces } = lastSession;
            console.log('Namespaces:', namespaces);
            
            const evmNamespace = namespaces['eip155'];
            if (evmNamespace) {
              console.log('EVM namespace:', evmNamespace);
              
              if (evmNamespace.accounts.length > 0) {
                console.log('Accounts:', evmNamespace.accounts);
                
                const accountParts = evmNamespace.accounts[0].split(':');
                console.log('Account parts:', accountParts);
                
                const [namespace, chainId, address] = accountParts;
                if (chainId === '1') {
                  console.log('Setting address:', address);
                  setAddress(address);
                  setNetwork('Ethereum');
                  setIsConnected(true);
                  setSession(lastSession);
                }
              }
            }
          } else {
            console.log('Session has expired');
          }
        } else {
          console.log('No previous session found');
        }

        client.on('session_update', ({ topic, params }) => {
          console.log('Session updated - topic:', topic);
          console.log('Session updated - params:', params);
          const { namespaces } = params;
          const evmNamespace = namespaces['eip155'];
          if (evmNamespace && evmNamespace.accounts.length > 0) {
            const [namespace, chainId, address] = evmNamespace.accounts[0].split(':');
            if (chainId === '1') {
              setAddress(address);
              setNetwork('Ethereum');
              setIsConnected(true);
            }
          }
        });

      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initializeClient();

    return () => {
      if (client) {
        console.log('Cleaning up WalletConnect client');
        client.core.relayer.events.removeAllListeners();
        setAddress(null);
        setNetwork(null);
        setIsConnected(false);
        setSession(null);
      }
    };
  }, []);

  const connect = useCallback(async () => {
    setIsInitializing(true);
    if (!signClient || !modal) return;

    try {
      const unsubscribe = modal.subscribeModal(() => {
        setIsInitializing(false);
      });

      const { uri, approval } = await signClient.connect({
        optionalNamespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'personal_sign',
              'eth_sign',
              'eth_signTypedData',
              'eth_signTypedData_v4'
            ],
            chains: ['eip155:1'],
            events: [
              'chainChanged',
              'accountsChanged',
              'connect',
              'disconnect'
            ],
          },
        },
      });

      if (uri) {
        modal.openModal({ uri });
      }

      const session = await approval();
      const { namespaces } = session;
      const evmNamespace = namespaces['eip155'];
      const address = evmNamespace.accounts[0].split(':')[2];
      const chainId = evmNamespace.accounts[0].split(':')[1];
      
      setAddress(address);
      setNetwork('Ethereum');
      setIsConnected(true);
      setSession(session);
      
      modal.closeModal();
      // Clean up subscription
      unsubscribe();
      return address;
    } catch (error) {
      console.error('Error connecting to EVM wallet:', error);
      modal.closeModal();
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [signClient, modal]);

  const disconnect = useCallback(async () => {
    if (!signClient || !session) return;

    try {
      await signClient.disconnect({
        topic: session.topic,
        reason: {
          code: 6000,
          message: 'User disconnected'
        }
      });
      setAddress(null);
      setNetwork(null);
      setIsConnected(false);
      setSession(null);
    } catch (error) {
      console.error('Error disconnecting EVM wallet:', error);
      throw error;
    }
  }, [signClient, session]);

  const getProvider = useCallback(() => {
    console.log('isConnected', isConnected);
    console.log('address', address);
    console.log('window.ethereum', window.ethereum);
    if (!isConnected || !address || !window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, [isConnected, address]);

  const getUSDTContract = useCallback(async (chainId: string) => {
    console.log('getUSDTContract bruh');
    const provider = getProvider();
    console.log('provider', provider);
    console.log('address', address);
    
    if (!provider || !address) return null;
  
    try {
      const signer = await provider.getSigner();
      return new ethers.Contract(
        USDT_ADDRESSES[chainId],
        USDT_ABI,
        signer
      );
    } catch (error) {
      console.error('Error getting USDT contract:', error);
      return null;
    }
  }, [getProvider, address]);

  const approveUSDT = useCallback(async (chainId: string, amount: string) => {
    if (!signClient || !session) {
      console.error('SignClient or session not available');
      return;
    }

    try {
      const contract = await getUSDTContract(chainId);
      if (!contract) throw new Error('Failed to get USDT contract');

      const amountInWei = ethers.parseUnits(amount, 6);

      // Use the signer from the provider to sign the transaction
      const provider = getProvider();
      if (!provider) throw new Error('Provider not available');

      const signer = await provider.getSigner();
      // @ts-ignore
      const tx = await contract.connect(signer).approve(
        SUPPORTED_NETWORKS[chainId].contracts.BRIDGE,
        amountInWei
      );
      await tx.wait();
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error;
    }
  }, [getUSDTContract, signClient, session, getProvider]);

  const getAllowance = useCallback(async (chainId: string, owner: string, spender: string) => {
    try {
      const contract = await getUSDTContract(chainId);
      if (!contract) throw new Error('Failed to get USDT contract');

      const allowance = await contract.allowance(owner, spender);
      return ethers.formatUnits(allowance, 6); // Assuming USDT has 6 decimals
    } catch (error) {
      console.error('Error getting allowance:', error);
      throw error;
    }
  }, [getUSDTContract]);

  return {
    address,
    network,
    isConnected,
    isInitializing,
    connect,
    disconnect,
    getProvider,
    signClient,
    approveUSDT,
    getAllowance,
  };
}; 