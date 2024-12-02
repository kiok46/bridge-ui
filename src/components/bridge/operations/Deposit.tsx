import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Transaction } from '../../../types';

interface DepositProps {
  selectedChain: string;
  approvedAmount: string;
  transaction: Transaction | null;
}

export const Deposit = ({ selectedChain, approvedAmount, transaction }: DepositProps) => {
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    // Implement deposit logic
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Deposit USDT
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
        onClick={handleDeposit}
        disabled={!approvedAmount || !amount}
      >
        Deposit
      </Button>
    </Box>
  );
}; 