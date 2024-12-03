import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';
import { Transaction } from '../../../types';
import { shortenAddress } from '../../../utils/helpers';

interface TransactionsProps {
  transactions: Transaction[];
  type: 'Deposit' | 'Withdrawal';
  onTransactionButtonClick: (transaction: Transaction) => void;
  loading?: boolean;
}

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
  <Box mt={1}>
    <Typography variant="body2" color="textSecondary">
      Tx: {shortenAddress(transaction.transactionHash)}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      Amount: {transaction.amount} USDT
    </Typography>
    <Typography variant="caption" color="textSecondary">
      Block: {transaction.blockNumber}
    </Typography>
  </Box>
);

const TransactionCard = ({ 
  transaction, 
  onTransactionButtonClick 
}: { 
  transaction: Transaction;
  onTransactionButtonClick: (transaction: Transaction) => void;
}) => (
  <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <TransactionDetails transaction={transaction} />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => onTransactionButtonClick(transaction)}
        sx={{ ml: 2 }}
      >
        View
      </Button>
    </Box>
  </Paper>
);

const Transactions = ({ transactions, type, onTransactionButtonClick, loading = false }: TransactionsProps) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="textSecondary" align="center">
          No {type.toLowerCase()} transactions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {type} Transactions
      </Typography>
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onTransactionButtonClick={onTransactionButtonClick}
        />
      ))}
    </Box>
  );
};

export default Transactions; 