import { Box, Button, Typography, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Transaction, TransactionType } from '../../../types';
import { useTransactions } from '../../../hooks/useTransactions';
import { useState } from 'react';
import { TransactionDetails, TransactionDetailsDialog } from './TransactionDetails';

interface TransactionsProps {
  evmAddress: string;
  bchAddress: string;
  onTransactionInspect: (transaction: Transaction) => void;
}

const TransactionCard = ({ 
  transaction, 
  onTransactionInspect
}: { 
  transaction: Transaction;
  onTransactionInspect: (transaction: Transaction) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInspect = () => {
    onTransactionInspect(transaction);
    handleClose();
  };

  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 1.5, 
          p: 1.5,
          backgroundColor: '#262933',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(182, 80, 158, 0.15)',
            cursor: 'pointer'
          },
          height: '60px',
        }}
        onClick={handleOpen}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          height: '100%'
        }}>
          <TransactionDetails 
            transaction={transaction} 
            explorerUrl={'https://bch.loping.net/tx/'}
            onInspect={handleInspect}
          /> 
        </Box>
      </Paper>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#08090A',
            backgroundImage: 'none',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#0A0B0D',
            color: '#F1F1F3',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Transaction Details
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: '#6E7177',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#F1F1F3'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            backgroundColor: '#0A0B0D',
            p: '0 !important'
          }}
        >
          <TransactionDetailsDialog 
            transaction={transaction} 
            explorerUrl={'https://bch.loping.net/tx/'}
            onInspect={handleInspect}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const Transactions = ({ 
  evmAddress, 
  bchAddress, 
  onTransactionInspect
}: TransactionsProps) => {
  const { loading, deposits, withdrawals } = useTransactions(evmAddress, bchAddress);
  const transactions: Transaction[] = [
    ...deposits.map(tx => ({...tx, type: 'Deposit' as TransactionType})),
    ...withdrawals.map(tx => ({...tx, type: 'Withdrawal' as TransactionType}))
  ];

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
          No transactions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      maxHeight: '400px'
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mb: 2,
          fontSize: '1.1rem',
          fontWeight: 500,
          color: '#F1F1F3'
        }}
      >
        Previous Transactions
      </Typography>
      <Box sx={{ 
        overflow: 'auto', 
        flex: 1,
        mr: -1, 
        pr: 1,
        pb: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
          },
        },
        maxHeight: 'calc(300px)',
      }}>
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onTransactionInspect={onTransactionInspect}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Transactions;