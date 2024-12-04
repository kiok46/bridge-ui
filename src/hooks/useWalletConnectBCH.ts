import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import { useState, useEffect } from 'react';
import { disconnect } from 'process';

const projectId = 'b6ee57015454e10cfc3ec52fcaa7ceff';
const wcMetadataBCH = {
  name: 'Token Bridge (BCH)',
  description: 'Token Bridge (BCH)',
  url: 'https://tokenbridge.cash/',
  icons: ['https://tokenbridge.cash/images/logo.png']
};

const network = "mainnet";
const connectedChain = network == "mainnet" ? "bch:bitcoincash" : "bch:bchtest";

const namespaces = {
  bch: {
    chains: [connectedChain],
    methods: ['bch_getAddresses', 'bch_signTransaction', 'bch_signMessage'],
    events: ['addressesChanged'],
  },
};

export const useWalletConnectBCH = () => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [lastSession, setSession] = useState(null);
  const [walletConnectModal, setWalletConnectModal] = useState<WalletConnectModal | null>(null);
  const [address, setAddress] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Setup WalletConnect client and event handlers on initial render
  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        setIsInitializing(true);
        const client = await SignClient.init({
          projectId: projectId,
          relayUrl: 'wss://relay.walletconnect.com',
          metadata: wcMetadataBCH
        });
        setSignClient(client);

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

        // Safely get the last session
        try {
          const sessions = client.session.getAll();
          if (sessions.length > 0) {
            const session = sessions[sessions.length - 1];
            setSession(session);
          }
        } catch (sessionError) {
          console.log("No active sessions found");
        }
      } catch (error) {
        console.log("Failed to initialize WalletConnect:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initWalletConnect();
  }, []);

  const connect = async () => {
    if (!signClient || !walletConnectModal) {
      console.log("SignClient or Modal not initialized");
      return;
    }

    try {
      // Clean up existing session if present
      if (lastSession) {
        try {
          await signClient.disconnect({
            topic: lastSession.topic,
            reason: { code: 6000, message: "User disconnected" }
          });
        } catch (e) {
          // Ignore any disconnect errors
          console.log("Previous session cleanup:", e?.message || "Failed");
        } finally {
          setSession(null);
        }
      }

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: namespaces,
        optionalNamespaces: namespaces
      });

      if (!uri) {
        console.log("No URI received for connection");
        return;
      }

      await walletConnectModal.openModal({
        uri,
        standaloneChains: [connectedChain]
      });

      const session = await approval();
      setSession(session);
    } catch (error) {
      console.log("Connection failed:", error?.message || "Unknown error");
    } finally {
      if (walletConnectModal) {
        walletConnectModal.closeModal();
      }
    }
  };

  const disconnect = async () => {
    if (!lastSession || !signClient) return;

    try {
      await signClient.disconnect({
        topic: lastSession.topic,
        reason: { code: 6000, message: "User disconnected" }
      });
    } catch (error) {
      // Ignore any disconnect errors
      console.log("Disconnect message:", error?.message || "Failed");
    } finally {
      setSession(null);
      setAddress('');
    }
  };

  const getUserAddress = async () => {
    if (!signClient || !lastSession) return;

    try {
      const result = await signClient.request({
        chainId: connectedChain,
        topic: lastSession.topic,
        request: {
          method: "bch_getAddresses",
          params: {},
        },
      });

      if (result?.[0]) {
        setAddress(result[0]);
      }
    } catch (error) {
      console.log("Failed to get address:", error?.message || "Unknown error");
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
      // onAddressChange(address);
    }
  }, [address]);

  return {
    address,
    isInitializing,
    isConnected: !!lastSession,
    connect,
    disconnect
  };
}; 