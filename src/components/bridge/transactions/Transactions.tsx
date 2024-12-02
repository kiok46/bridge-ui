import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Transaction } from '../../../types';
import { shortenAddress } from '../../../utils/helpers';

interface TransactionsProps {
  transactions: Transaction[];
  type: 'Deposit' | 'Withdrawal';
  onTransactionButtonClick: (transaction: Transaction) => void;
  loading?: boolean;
}

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
        <Button
          key={transaction.id}
          variant="outlined"
          onClick={() => onTransactionButtonClick(transaction)}
          fullWidth
          sx={{ 
            mb: 1,
            justifyContent: 'space-between',
            textAlign: 'left',
            p: 2
          }}
        >
          <Box>
            <Typography variant="subtitle2">
              Tx: {shortenAddress(transaction.transactionHash)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Amount: {transaction.amount} USDT
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">
              {transaction.blockNumber}
            </Typography>
          </Box>
        </Button>
      ))}
    </Box>
  );
};

export default Transactions; 