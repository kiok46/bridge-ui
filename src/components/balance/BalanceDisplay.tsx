import { Grid } from '@mui/material';
import { TokenBalance } from './TokenBalance';
import { TokenConfig } from '../../types/tokens';


interface BalanceDisplayProps {
  tokenConfig: TokenConfig;
}

export const BalanceDisplay = ({ tokenConfig }: BalanceDisplayProps) => {
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={12}>
        <TokenBalance tokenConfig={tokenConfig} />
      </Grid>
    </Grid>
  );
}; 