import { Grid } from '@mui/material';
import { TokenBalance } from './TokenBalance';
import Approval from './Approval';

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
        <TokenBalance usdtBalance={usdtBalance} />
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