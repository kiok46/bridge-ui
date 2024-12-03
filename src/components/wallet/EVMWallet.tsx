import { Box, Typography, Button, Stack } from '@mui/material';
import { WalletConnect } from './WalletConnect';
import { useWalletContext } from '../../hooks/useWalletContext';
import { themeConstants } from '../../theme/constants';

export const EVMWallet = () => {
  const { userEVMAddress, disconnectEVM, evmNetwork, connectEVM } = useWalletContext();

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
        EVM Network Connection
      </Typography>

      {userEVMAddress ? (
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
              {evmNetwork}
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
              }}
            >
              {userEVMAddress.slice(0, 6)}...{userEVMAddress.slice(-4)}
            </Typography>
          </Box>
          
          <Button
            onClick={disconnectEVM}
            fullWidth
            sx={{
              background: themeConstants.colors.background.button,
              color: themeConstants.colors.error.main,
              textTransform: 'none',
              borderRadius: themeConstants.borderRadius.medium,
              padding: '10px',
              border: `1px solid ${themeConstants.colors.error.light}`,
              fontFamily: themeConstants.typography.fontFamily,
              fontWeight: 500,
              '&:hover': {
                background: 'rgba(255, 67, 67, 0.1)',
                border: '1px solid rgba(255, 67, 67, 0.3)',
              }
            }}
          >
            Disconnect EVM Wallet
          </Button>
        </Box>
      ) : (
        <WalletConnect onConnect={connectEVM} />
      )}
    </Stack>
  );
}; 