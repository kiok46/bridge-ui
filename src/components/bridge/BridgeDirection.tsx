import { Box, Button, Alert } from '@mui/material';
import { Transaction, TransactionType } from '../../types';
import { useState } from 'react';

interface BridgeDirectionProps {
  activeTransaction: Transaction | null;
  onReset: () => void;
}

export const BridgeDirection = ({
  activeTransaction,
  onReset
}: BridgeDirectionProps) => {
  const [direction, setDirection] = useState<TransactionType>(TransactionType.DEPOSIT);

  return (
  <>
    {activeTransaction && (
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Alert 
          severity="info"
          sx={{
            backgroundColor: 'rgba(46, 186, 198, 0.1)',
            color: '#2EBAC6',
            flex: 1
          }}
        >
          Currently inspecting transaction: {activeTransaction.transactionHash}
        </Alert>
        <Button
          variant="outlined"
          onClick={onReset}
          sx={{
            color: '#2EBAC6',
            borderColor: '#2EBAC6',
            '&:hover': {
              backgroundColor: 'rgba(46, 186, 198, 0.1)', 
              borderColor: '#2EBAC6'
            },
            whiteSpace: 'nowrap'
          }}
        >
          Return to Bridge
        </Button>
      </Box>
    )}

    {!activeTransaction && (
      <Box display="flex" justifyContent="center" mb={2}>
        <Button 
        variant={direction === TransactionType.DEPOSIT ? 'contained' : 'outlined'}
        onClick={() => setDirection(TransactionType.DEPOSIT)}
        sx={{ 
          marginRight: '1rem',
          backgroundColor: direction === TransactionType.DEPOSIT ? '#B6509E' : 'transparent',
          color: direction === TransactionType.DEPOSIT ? '#ffffff' : '#B6509E',
          borderColor: '#B6509E',
          '&:hover': {
            backgroundColor: direction === TransactionType.DEPOSIT ? '#A3458C' : 'rgba(182, 80, 158, 0.1)',
          },
          borderRadius: '8px',
          padding: '0.5rem 1.5rem',
        }}
      >
        Deposit
      </Button>
      <Button 
        variant={direction === TransactionType.WITHDRAWAL ? 'contained' : 'outlined'}
        onClick={() => setDirection(TransactionType.WITHDRAWAL)}
        sx={{
          backgroundColor: direction === TransactionType.WITHDRAWAL ? '#2EBAC6' : 'transparent',
          color: direction === TransactionType.WITHDRAWAL ? '#ffffff' : '#2EBAC6',
          borderColor: '#2EBAC6',
          '&:hover': {
            backgroundColor: direction === TransactionType.WITHDRAWAL ? '#259DAF' : 'rgba(46, 186, 198, 0.1)',
          },
          borderRadius: '8px',
          padding: '0.5rem 1.5rem',
        }}
      >
        Withdraw
      </Button>
      </Box>
    )}
  </>
  );
}; 