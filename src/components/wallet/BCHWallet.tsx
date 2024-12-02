import { Box, Paper, Typography } from '@mui/material';
import { WalletConnect } from '../../walletconnect';

interface BCHWalletProps {
  userBCHAddress: string;
  onBCHAddressChange: (address: string) => void;
}

export const BCHWallet = ({ userBCHAddress, onBCHAddressChange }: BCHWalletProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom color="secondary" sx={{ mb: 2 }}>
        BCH Network Connection
      </Typography>
      
      {userBCHAddress ? (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Network:</strong> Bitcoin Cash
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, wordBreak: 'break-all' }}>
            <strong>Address:</strong> {userBCHAddress}
          </Typography>
          <WalletConnect onBCHAddressChange={onBCHAddressChange} />
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Connect your Bitcoin Cash wallet using WalletConnect
          </Typography>
          <WalletConnect onBCHAddressChange={onBCHAddressChange} />
        </Box>
      )}
    </Paper>
  );
}; 