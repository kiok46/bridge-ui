import { Paper, Typography } from '@mui/material';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { TokenConfig } from '../../types/tokens';

export const TokenBalance = ({ tokenConfig }: { tokenConfig: TokenConfig }) => {
  const tokenBalance = useTokenBalance(tokenConfig);
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#2C2F36', // Darker background
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{
          color: '#FFFFFF', // Lighter text color
          fontWeight: 'bold'
        }}
      >
        Wrapped on BCH: {tokenBalance}
      </Typography>
    </Paper>
  );
}; 