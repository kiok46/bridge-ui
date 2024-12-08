import { Box, Button, Alert } from '@mui/material';
import { Transaction, TransactionType } from '../../types';

interface BridgeDirectionProps {
  activeTransaction: Transaction | null;
  onReset: () => void;
  onDirectionChange: (direction: TransactionType) => void;
}

export const BridgeDirection = ({
  activeTransaction,
  onReset,
  onDirectionChange
}: BridgeDirectionProps) => {

  return (
  <>
    {activeTransaction?.id && (
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, width: '100%' }}>
        <Alert 
          severity="info"
          sx={{
            backgroundColor: 'rgba(46, 186, 198, 0.1)',
            color: '#2EBAC6',
            flex: 1,
            width: '100%',
            wordBreak: 'break-all'
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
            whiteSpace: 'nowrap',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Return to Bridge
        </Button>
      </Box>
    )}

    {!activeTransaction.id && (
      <Box display="flex" justifyContent="center" mb={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Button 
          variant={activeTransaction.type === TransactionType.DEPOSIT ? 'contained' : 'outlined'}
          onClick={() => onDirectionChange(TransactionType.DEPOSIT)}
          sx={{ 
            backgroundColor: activeTransaction.type === TransactionType.DEPOSIT ? '#B6509E' : 'transparent',
            color: activeTransaction.type === TransactionType.DEPOSIT ? '#ffffff' : '#B6509E',
            borderColor: '#B6509E',
            '&:hover': {
              backgroundColor: activeTransaction.type === TransactionType.DEPOSIT ? '#A3458C' : 'rgba(182, 80, 158, 0.1)',
            },
            borderRadius: '8px',
            padding: '0.5rem 1.5rem',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Deposit
        </Button>
        <Button 
          variant={activeTransaction.type === TransactionType.WITHDRAWAL ? 'contained' : 'outlined'}
          onClick={() => onDirectionChange(TransactionType.WITHDRAWAL)}
          sx={{
            backgroundColor: activeTransaction.type === TransactionType.WITHDRAWAL ? '#2EBAC6' : 'transparent',
            color: activeTransaction.type === TransactionType.WITHDRAWAL ? '#ffffff' : '#2EBAC6',
            borderColor: '#2EBAC6',
            '&:hover': {
              backgroundColor: activeTransaction.type === TransactionType.WITHDRAWAL ? '#259DAF' : 'rgba(46, 186, 198, 0.1)',
            },
            borderRadius: '8px',
            padding: '0.5rem 1.5rem',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Withdraw
        </Button>
      </Box>
    )}
  </>
  );
}; 