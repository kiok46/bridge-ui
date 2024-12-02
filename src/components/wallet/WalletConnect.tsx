import { Button } from '@mui/material';

interface WalletConnectProps {
  onBCHAddressChange: (address: string) => void;
}

export const WalletConnect = ({ onBCHAddressChange }: WalletConnectProps) => {
  const handleConnect = async () => {
    try {
      // Implement your BCH wallet connection logic here
      // This is a placeholder - replace with actual wallet connection
      const mockAddress = 'bitcoincash:qzxcvbnm...';
      onBCHAddressChange(mockAddress);
    } catch (error) {
      console.error('Error connecting BCH wallet:', error);
    }
  };

  return (
    <Button 
      variant="contained" 
      color="secondary" 
      onClick={handleConnect}
      fullWidth
    >
      Connect BCH Wallet
    </Button>
  );
}; 