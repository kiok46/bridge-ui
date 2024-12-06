import { Paper, Typography } from '@mui/material';
import { useUSDTBalance } from '../../hooks/useUSDTBalance';

export const TokenBalance = () => {
  const usdtBalance = useUSDTBalance();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#e0e3eb', // Slightly darker background for contrast
        borderRadius: '12px', // Rounded corners
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Aave's subtle shadow
      }}
    >
      <Typography 
        variant="h6" 
        sx={{
          color: '#1a1a5e', // Darker text color for better contrast
          fontWeight: 'bold'
        }}
      >
        Wrapped USDT on BCH: {usdtBalance}
      </Typography>
    </Paper>
  );
}; 