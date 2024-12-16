import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useApproval } from '../../hooks/useApproval';
import { formatAmount } from '../../utils/helpers';
import { TokenConfig } from '../../types/tokens';

interface ApprovalProps {
  tokenConfig?: TokenConfig;
  amount: string;
  onApprovalComplete: () => void;
  address: string;
}

export const Approval = ({ tokenConfig, amount, onApprovalComplete, address }: ApprovalProps) => {
  const [needsApproval, setNeedsApproval] = useState(false);
  const { checkAllowance, approve } = useApproval(tokenConfig, address);

  useEffect(() => {
    const checkApprovalNeeded = async () => {
      if (!tokenConfig) return;
      const allowance = await checkAllowance();
      setNeedsApproval(Number(amount) > Number(allowance));
    };

    if (amount && tokenConfig) {
      checkApprovalNeeded();
    }
  }, [amount, checkAllowance, tokenConfig]);

  const handleApprove = async () => {
    if (!tokenConfig) return;
    try {
      await approve(amount);
      setNeedsApproval(false);
      onApprovalComplete();
    } catch (error) {
      console.error('Error during approval:', error);
    }
  };

  if (!needsApproval) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Approval needed for {formatAmount(amount, tokenConfig.decimals)} {tokenConfig.symbol}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApprove}
        fullWidth
      >
        Approve Token
      </Button>
    </Box>
  );
};

export default Approval;
