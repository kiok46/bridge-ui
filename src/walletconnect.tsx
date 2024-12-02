import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';

import { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';

const projectId = 'b6ee57015454e10cfc3ec52fcaa7ceff';
// Wallet Connect Metadata
const wcMetadata = {
  name: 'Token Bridge',
  description: 'Token Bridge',
  url: 'https://tokenbridge.cash/',
  icons: ['https://tokenbridge.cash/images/logo.png']
};

const network = "mainnet";
const connectedChain = network == "mainnet" ? "bch:bitcoincash" : "bch:bchtest";

const requiredNamespaces = {
  bch: {
    chains: [connectedChain],
    methods: ['bch_getAddresses', 'bch_signTransaction', 'bch_signMessage'],
    events: ['addressesChanged'],
  },
};

interface WalletConnectProps {
  onBCHAddressChange: (address: string) => void;
}

// Create WalletConnect component to handle initialization
export const WalletConnect: React.FC<WalletConnectProps> = ({ onBCHAddressChange }) => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [lastSession, setLastSession] = useState(null);
  const [walletConnectModal, setWalletConnectModal] = useState<WalletConnectModal | null>(null);
  const [address, setAddress] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Setup WalletConnect client and event handlers on initial render
  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        setIsInitializing(true);
        // Initialize SignClient first
        const client = await SignClient.init({
          projectId: projectId,
          relayUrl: 'wss://relay.walletconnect.com',
          metadata: wcMetadata
        });
        setSignClient(client);

        // Initialize modal after SignClient
        const modal = new WalletConnectModal({
          projectId: projectId,
          themeMode: 'dark',
          themeVariables: {
            '--wcm-background-color': '#20c997',
            '--wcm-accent-color': '#20c997',
          },
          explorerExcludedWalletIds: 'ALL',
        });
        setWalletConnectModal(modal);

        // Get last session
        const lastKeyIndex = client.session.getAll().length - 1;
        if (lastKeyIndex >= 0) {
          const session = client.session.getAll()[lastKeyIndex];
          setLastSession(session);
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initWalletConnect();
  }, []);

  const handleConnect = async () => {
    try {
      console.log("Connect button clicked");
      console.log("SignClient status:", !!signClient);
      console.log("Modal status:", !!walletConnectModal);

      if (!signClient || !walletConnectModal) {
        console.error("SignClient or Modal not initialized");
        return;
      }

      // Clear any existing sessions first
      if (lastSession) {
        try {
          await signClient.disconnect({
            topic: lastSession.topic,
            reason: {
              code: 6000,
              message: "User disconnected"
            }
          });
          setLastSession(null);
        } catch (e) {
          console.log("Error clearing previous session:", e);
        }
      }

      console.log("Requesting connection...");
      const { uri, approval } = await signClient.connect({
        requiredNamespaces,
        // Add optional namespaces if needed
        optionalNamespaces: {
          bch: {
            chains: [connectedChain],
            methods: ['bch_getAddresses', 'bch_signTransaction', 'bch_signMessage'],
            events: ['addressesChanged'],
          }
        }
      });

      console.log("Got URI:", uri);

      if (!uri) {
        console.error("No URI received");
        return;
      }

      console.log("Opening modal...");
      await walletConnectModal.openModal({
        uri,
        standaloneChains: [connectedChain]
      });

      console.log("Waiting for approval...");
      const session = await approval();
      console.log("Session approved:", session);
      setLastSession(session);

      walletConnectModal.closeModal();
    } catch (error) {
      console.error("Connection error:", error);
      if (walletConnectModal) {
        walletConnectModal.closeModal();
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      if (lastSession && signClient) {
        try {
          await signClient.disconnect({
            topic: lastSession.topic,
            reason: {
              code: 6000,
              message: "User disconnected"
            }
          });
        } catch (disconnectError) {
          // If the error is "No matching key", the session is already gone
          if (disconnectError.message.includes('No matching key')) {
            console.log('Session already disconnected');
          } else {
            throw disconnectError; // Re-throw other errors
          }
        }
        // Always clean up the state, even if disconnect fails
        setLastSession(null);
        setAddress('');
        onBCHAddressChange('');
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      // Clean up state even on error
      setLastSession(null);
      setAddress('');
      onBCHAddressChange('');
    }
  };

  const getUserAddress = async () => {
    try {
      if (!signClient || !lastSession) return;
      
      const result = await signClient.request({
        chainId: connectedChain,
        topic: lastSession.topic,
        request: {
          method: "bch_getAddresses",
          params: {},
        },
      });
      setAddress(result[0]);
    } catch (error) {
      console.error("Error getting address:", error);
      setAddress('');
    }
  };

  useEffect(() => {
    if (lastSession && signClient) {
      getUserAddress();
    } else {
      setAddress('');
    }
  }, [lastSession, signClient]);

  useEffect(() => {
    if (address !== '') {
      onBCHAddressChange(address);
    }
  }, [address]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {!lastSession ? (
        // Connect button - only shown when disconnected
        <Button 
          variant="contained"
          onClick={handleConnect}
          disabled={isInitializing}
          fullWidth
        >
          {isInitializing 
            ? "Initializing..."
            : "Connect BCH Wallet"}
        </Button>
      ) : (
        // Connected state - only show disconnect button
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleDisconnect}
          fullWidth
        >
          Disconnect BCH Wallet
        </Button>
      )}
    </Box>
  );
};


