declare module '@electrum-cash/network';
declare module 'cashscript';

interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, handler: (...args: any[]) => void) => void;
    removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
    selectedAddress?: string;
    chainId?: string;
    networkVersion?: string;
    isConnected: () => boolean;
  };
} 