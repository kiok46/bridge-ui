import { Box, Button, Typography } from '@mui/material';
import { Transaction } from '../../types';

interface TransactionsProps {
  transactions: Transaction[];
  type: 'Deposit' | 'Withdrawal';
  onTransactionButtonClick: (transaction: Transaction) => void;
}

const Transactions = ({ transactions, type, onTransactionButtonClick }: TransactionsProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {type} Transactions
      </Typography>
      {transactions.map((transaction) => (
        <Button
          key={transaction.id}
          variant="outlined"
          onClick={() => onTransactionButtonClick(transaction)}
          fullWidth
          sx={{ mb: 1 }}
        >
          {transaction.transactionHash.substring(0, 10)}...
          {transaction.amount} USDT
        </Button>
      ))}
    </Box>
  );
};

export default Transactions; 