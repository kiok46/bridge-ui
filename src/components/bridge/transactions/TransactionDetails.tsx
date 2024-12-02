import { Box, Paper, Typography, Link, Chip } from '@mui/material';
import { Transaction } from '../../../types';
import { shortenAddress } from '../../../utils/helpers';

interface TransactionDetailsProps {
  transaction: Transaction;
  explorerUrl: string;
}

export const TransactionDetails = ({ transaction, explorerUrl }: TransactionDetailsProps) => {
  const getStatusChip = () => {
    if (transaction.type === 'Deposit') {
      if (transaction.claimNFTBurnTransactionHash) {
        return <Chip label="Completed" color="success" />;
      } else if (transaction.claimNFTIssuanceTransactionHash) {
        return <Chip label="Claim NFT Issued" color="primary" />;
      }
    } else {
      if (transaction.processExitTransactionHash) {
        return <Chip label="Completed" color="success" />;
      } else if (transaction.exitIdTransactionHash) {
        return <Chip label="Exit Initiated" color="primary" />;
      }
    }
    return <Chip label="Pending" color="warning" />;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transaction Details
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Status
        </Typography>
        {getStatusChip()}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Transaction Hash
        </Typography>
        <Link 
          href={`${explorerUrl}/tx/${transaction.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {shortenAddress(transaction.transactionHash)}
        </Link>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Amount
        </Typography>
        <Typography>{transaction.amount} USDT</Typography>
      </Box>

      {transaction.type === 'Deposit' && transaction.claimNFTIssuanceTransactionHash && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Claim NFT Transaction
          </Typography>
          <Link 
            href={`${explorerUrl}/tx/${transaction.claimNFTIssuanceTransactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortenAddress(transaction.claimNFTIssuanceTransactionHash)}
          </Link>
        </Box>
      )}

      {transaction.type === 'Withdrawal' && transaction.exitId && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Exit ID
          </Typography>
          <Typography>{transaction.exitId}</Typography>
        </Box>
      )}
    </Paper>
  );
}; 