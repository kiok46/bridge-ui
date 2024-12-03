import { Grid } from '@mui/material';
import { TokenBalance } from '../balance/TokenBalance';
import { Approval } from '../balance/Approval';

interface BalanceDisplayProps {
  usdtBalance: string;
  selectedChain: string;
  amount: string;
  onApprovalComplete: () => void;
  needsApproval: boolean;
}

export const BalanceDisplay = ({ 
  usdtBalance, 
  selectedChain,
  amount,
  onApprovalComplete,
  needsApproval
}: BalanceDisplayProps) => {
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={12}>
        <TokenBalance usdtBalance={usdtBalance} />
      </Grid>
      {needsApproval && (
        <Grid item xs={12}>
          <Approval 
            selectedChain={selectedChain}
            amount={amount}
            onApprovalComplete={onApprovalComplete}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default BalanceDisplay; 