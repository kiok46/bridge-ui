import { Grid } from '@mui/material';
import { TokenBalance } from './TokenBalance';

interface BalanceDisplayProps {
  usdtBalance: string;
  selectedChain: string;
}

export const BalanceDisplay = ({ 
  usdtBalance, 
  selectedChain
}: BalanceDisplayProps) => {
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={12}>
        <TokenBalance />
      </Grid>
    </Grid>
  );
}; 