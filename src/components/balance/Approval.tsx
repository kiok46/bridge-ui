import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useApproval } from '../../hooks/useApproval';
import { formatAmount } from '../../utils/helpers';

interface ApprovalProps {
  selectedChain: string;
  amount: string;
  onApprovalComplete: () => void;
}

export const Approval = ({ selectedChain, amount, onApprovalComplete }: ApprovalProps) => {
  const [needsApproval, setNeedsApproval] = useState(false);
  const { checkAllowance, approve } = useApproval(selectedChain);

  useEffect(() => {
    const checkApprovalNeeded = async () => {
      const allowance = await checkAllowance();
      setNeedsApproval(Number(amount) > Number(allowance));
    };

    if (amount) {
      checkApprovalNeeded();
    }
  }, [amount, checkAllowance]);

  const handleApprove = async () => {
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
        Approval needed for {formatAmount(amount)} USDT
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApprove}
        fullWidth
      >
        Approve USDT
      </Button>
    </Box>
  );
};

export default Approval;
