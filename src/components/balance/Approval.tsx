import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useApproval } from '../../hooks/useApproval';
import { formatAmount } from '../../utils/helpers';
import { useWalletConnectEVM } from '../../hooks/useWalletConnectEVM';

interface ApprovalProps {
  selectedChain: string;
  amount: string;
  onApprovalComplete: () => void;
  address: string;
}

export const Approval = ({ selectedChain, amount, onApprovalComplete, address }: ApprovalProps) => {
  const [needsApproval, setNeedsApproval] = useState(false);
  const { checkAllowance, approve } = useApproval(selectedChain, address);

  const { address: evmAddress, approveUSDT} = useWalletConnectEVM();
  console.log('ok', evmAddress);

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
      console.log('ok1');
      await approveUSDT("111555111", amount);
      console.log('ok2');
      setNeedsApproval(false);
      console.log('ok3');
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
