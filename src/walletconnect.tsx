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

// Create WalletConnect component to handle initialization
export const WalletConnect = () => {
  const [signClient, setSignClient] = useState(null);
  const [lastSession, setLastSession] = useState(null);
  const [walletConnectModal, setWalletConnectModal] = useState(null);
  const [address, setAddress] = useState('');

  // Setup WalletConnect client and event handlers on initial render
  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        // Initialize SignClient first
        const client = await SignClient.init({
          projectId: projectId,
          relayUrl: 'wss://relay.walletconnect.com',
          metadata: wcMetadata
        });
        console.log("SignClient initialized:", client);
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
        console.log("Modal initialized");
        setWalletConnectModal(modal);

        // Get last session
        const lastKeyIndex = client.session.getAll().length - 1;
        if (lastKeyIndex >= 0) {
          const session = client.session.getAll()[lastKeyIndex];
          setLastSession(session);
          console.log("Found existing session:", session);
        }
      } catch (error) {
        console.error("Init error:", error);
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
      if (lastSession) {
        await signClient.disconnect({
          topic: lastSession.topic,
          reason: {
            code: 6000,
            message: "User disconnected"
          }
        });
        setLastSession(null);
        setAddress('');
      }
    } catch (error) {
      console.error("Disconnect error:", error);
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
    if (lastSession) {
      getUserAddress();
    } else {
      setAddress('');
    }
  }, [lastSession]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {!lastSession ? (
        // Connect button - only shown when disconnected
        <Button 
          variant="contained"
          onClick={handleConnect}
          disabled={!signClient || !walletConnectModal}
          sx={{ bgcolor: '#20c997', '&:hover': { bgcolor: '#18a47a' } }}
        >
          {!signClient || !walletConnectModal 
            ? "Initializing..."
            : "Connect BCH Wallet"}
        </Button>
      ) : (
        // Connected state - shows address and disconnect button
        <>
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: '#198754', 
              '&:hover': { bgcolor: '#157347' },
              minWidth: 'fit-content'
            }}
          >
            Connected
          </Button>
          <Typography variant="body2">
            {address}
          </Typography>
          <Button 
            variant="outlined"
            onClick={handleDisconnect}
            sx={{ 
              color: '#dc3545', 
              borderColor: '#dc3545',
              '&:hover': { 
                bgcolor: 'rgba(220, 53, 69, 0.04)',
                borderColor: '#bb2d3b'
              }
            }}
          >
            Disconnect
          </Button>
        </>
      )}
    </Box>
  );
};


