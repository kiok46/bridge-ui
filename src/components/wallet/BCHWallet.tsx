import { Box, Typography, Button, Stack } from '@mui/material';
import { WalletConnect } from './WalletConnect';
import { useBCHWallet } from '../../hooks/useWallet';
import { themeConstants } from '../../theme/constants';

export const BCHWallet = () => {
  const { userBCHAddress, connectWallet, disconnectWallet } = useBCHWallet();

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
        Bitcoin Cash Wallet
      </Typography>

      {userBCHAddress ? (
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
              Bitcoin Cash
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
              {userBCHAddress}
            </Typography>
          </Box>
          
          <Button
            onClick={disconnectWallet}
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
            Disconnect BCH Wallet
          </Button>
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
            Connect your Bitcoin Cash wallet using WalletConnect
          </Typography>
          <WalletConnect onConnect={connectWallet} />
        </Box>
      )}
    </Stack>
  );
}; 