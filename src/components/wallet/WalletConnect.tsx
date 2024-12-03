import { Button } from '@mui/material';
import { themeConstants } from '../../theme/constants';

interface WalletConnectProps {
  onConnect: () => Promise<void>;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  return (
    <Button
      onClick={onConnect}
      fullWidth
      sx={{
        background: themeConstants.colors.primary.gradient,
        color: '#FFFFFF',
        textTransform: 'none',
        borderRadius: themeConstants.borderRadius.medium,
        padding: '10px',
        fontFamily: themeConstants.typography.fontFamily,
        fontWeight: 500,
        '&:hover': {
          background: themeConstants.colors.primary.gradientHover,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      Connect with WalletConnect
    </Button>
  );
}; 