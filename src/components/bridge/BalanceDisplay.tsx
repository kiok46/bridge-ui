import { Grid, Paper, Typography } from '@mui/material';
import Approval from '../balance/Approval';

interface BalanceDisplayProps {
  usdtBalance: string;
  selectedChain: string;
  setApprovedAmountCallback: (amount: string) => void;
}

export const BalanceDisplay = ({ 
  usdtBalance, 
  selectedChain, 
  setApprovedAmountCallback 
}: BalanceDisplayProps) => {
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6">Wrapped USDT on BCH: {usdtBalance}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Approval 
          selectedChain={selectedChain} 
          setApprovedAmountCallback={setApprovedAmountCallback} 
        />
      </Grid>
    </Grid>
  );
}; 