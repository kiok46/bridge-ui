import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Transaction } from '../../../types';

interface WithdrawProps {
  selectedChain: string;
  transaction: Transaction | null;
}

export const Withdraw = ({ selectedChain, transaction }: WithdrawProps) => {
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    // Implement withdraw logic
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Withdraw USDT
      </Typography>
      <TextField
        fullWidth
        type="number"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleWithdraw}
        disabled={!amount}
      >
        Withdraw
      </Button>
    </Box>
  );
}; 