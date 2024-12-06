import { Box, Typography, Stack, Button } from '@mui/material';
import { ConnectButton } from '../ConnectButton';
import { themeConstants } from '../../theme/constants';
import { useWalletEVM } from '../../hooks/useWalletEVM';

export const EVMWallet = () => {
  const { address, disconnect, network, connect, isInitializing } = useWalletEVM();

  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: themeConstants.colors.text.primary,
          fontSize: '1.1rem',
          fontFamily: themeConstants.typography.fontFamily,
          mb: 1
        }}
      >
        EVM Wallet
      </Typography>

      {address ? (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography
              sx={{
                color: themeConstants.colors.text.secondary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily
              }}
            >
              Network
            </Typography>
            <Typography
              sx={{
                color: themeConstants.colors.text.primary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily,
                background: 'rgba(21, 126, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: themeConstants.borderRadius.small,
                border: '1px solid rgba(21, 126, 255, 0.2)',
              }}
            >
              {network}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography
              sx={{
                color: themeConstants.colors.text.secondary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily
              }}
            >
              Connected Address
            </Typography>
            <Typography
              sx={{
                color: themeConstants.colors.text.primary,
                fontSize: '0.875rem',
                fontFamily: themeConstants.typography.fontFamily,
                background: 'rgba(21, 126, 255, 0.05)',
                padding: '4px 8px',
                borderRadius: themeConstants.borderRadius.small,
                border: '1px solid rgba(21, 126, 255, 0.2)',
                wordBreak: 'break-all'
              }}
            >
              {address}
            </Typography>
          </Box>
          
          <ConnectButton
            onClick={disconnect}
            fullWidth
          >
            Disconnect EVM Wallet
          </ConnectButton>
        </Box>
      ) : (
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              color: themeConstants.colors.text.secondary,
              fontFamily: themeConstants.typography.fontFamily
            }}
          >
            Connect your EVM wallet using WalletConnect
          </Typography>
          <ConnectButton 
            onClick={connect}
            disabled={isInitializing}
            fullWidth
          >
            {isInitializing 
              ? "Initializing..."
              : "Connect to EVM Network"}
          </ConnectButton>
        </Box>
      )}
    </Stack>
  );
}; 