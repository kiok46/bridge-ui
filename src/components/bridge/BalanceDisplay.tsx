import { Grid } from '@mui/material';
import { TokenBalance } from '../balance/TokenBalance';
import { Approval } from '../balance/Approval';

import { TokenConfig } from '../../types/tokens';

interface BalanceDisplayProps {
  tokenConfig: TokenConfig;
  amount: string;
  onApprovalComplete: () => void;
  needsApproval: boolean;
  address: string;
}

export const BalanceDisplay = ({ 
  tokenConfig,
  amount,
  onApprovalComplete,
  needsApproval,
  address
}: BalanceDisplayProps) => {
  return (
    <Grid container spacing={3} mb={2}>
      <Grid item xs={12}>
        <TokenBalance tokenConfig={tokenConfig} />
      </Grid>
      {needsApproval && (
        <Grid item xs={12}>
          <Approval 
            tokenConfig={tokenConfig}
            amount={amount}
            onApprovalComplete={onApprovalComplete}
            address={address}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default BalanceDisplay; 