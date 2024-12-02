import { Box, Button, Paper, Typography } from '@mui/material';

interface EVMWalletProps {
  network: string;
  userEVMAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const EVMWallet = ({ network, userEVMAddress, onConnect, onDisconnect }: EVMWalletProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        EVM Network Connection
      </Typography>
      
      {userEVMAddress ? (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Network:</strong> {network}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, wordBreak: 'break-all' }}>
            <strong>Address:</strong> {userEVMAddress}
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={onDisconnect}
            fullWidth
          >
            Disconnect EVM Wallet
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Connect your MetaMask or other EVM wallet to start bridging tokens
          </Typography>
          <Button 
            variant="contained" 
            onClick={onConnect}
            fullWidth
          >
            Connect EVM Wallet
          </Button>
        </Box>
      )}
    </Paper>
  );
}; 