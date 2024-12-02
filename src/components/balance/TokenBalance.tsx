import { Paper, Typography } from '@mui/material';

interface TokenBalanceProps {
  usdtBalance: string;
}

export const TokenBalance = ({ usdtBalance }: TokenBalanceProps) => {
  return (
    <Paper elevation={3} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6">Wrapped USDT on BCH: {usdtBalance}</Typography>
    </Paper>
  );
}; 