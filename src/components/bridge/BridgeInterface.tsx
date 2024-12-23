import { Paper, Alert, Grid } from '@mui/material';
import { Deposit } from './operations/Deposit';
import { Withdraw } from './operations/Withdraw';
import { Transaction, TransactionType } from '../../types';

interface BridgeInterfaceProps {
  activeTransaction: Transaction | null;
  connectedBchAddress: string;
  connectedEvmAddress: string;
  onTransactionUpdate: (transaction: Transaction) => void;
}

export const BridgeInterface = ({
  activeTransaction,
  connectedBchAddress,
  connectedEvmAddress,
  onTransactionUpdate
}: BridgeInterfaceProps) => {

  return (
    <Grid 
      container 
      spacing={2} 
      sx={{ 
        minHeight: '600px',
        alignItems: 'flex-start'
      }}
    >
      {/* Left side - Bridge Interface */}
      <Grid item xs={12} md={12}>
        <Paper 
          elevation={3} 
          sx={{ 
            padding: '2rem',
            minHeight: '600px',
            backgroundColor: '#1B2030',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 2
          }}
        >
          {activeTransaction.type === TransactionType.DEPOSIT ? (
            <Deposit 
              transaction={activeTransaction}
              connectedBchAddress={connectedBchAddress}
              connectedEvmAddress={connectedEvmAddress}
              onTransactionUpdate={onTransactionUpdate}
            />
          ) : (
            <Withdraw 
              transaction={activeTransaction}
              connectedBchAddress={connectedBchAddress}
              connectedEvmAddress={connectedEvmAddress}
            />
          )}

          <Alert 
            severity="info" 
            sx={{ 
              marginTop: '1rem',
              backgroundColor: 'rgba(46, 186, 198, 0.1)',
              color: '#2EBAC6',
              borderRadius: '8px',
              border: '1px solid rgba(46, 186, 198, 0.2)'
            }}
          >
            Note: Bridging process may take 2 hours to 1 day to complete
          </Alert>
        </Paper>
      </Grid>
    </Grid>
  );
}; 