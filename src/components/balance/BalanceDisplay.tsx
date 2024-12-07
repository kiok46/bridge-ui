import { Grid } from '@mui/material';
import { TokenBalance } from './TokenBalance';
import { TokenConfig } from '../../types/tokens';


interface BalanceDisplayProps {
  selectedToken: TokenConfig;
}

export const BalanceDisplay = ({ selectedToken }: BalanceDisplayProps) => {
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={12}>
        <TokenBalance selectedToken={selectedToken} />
      </Grid>
    </Grid>
  );
}; 