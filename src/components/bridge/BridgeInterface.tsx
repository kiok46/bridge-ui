import { Box, Button, Paper, Alert, Grid } from '@mui/material';
import { Deposit } from './operations/Deposit';
import { Withdraw } from './operations/Withdraw';
import { Transaction, TransactionType } from '../../types';
import { TokenConfig } from '../../types/tokens';
import { useState } from 'react';

interface BridgeInterfaceProps {
  direction: TransactionType;
  selectedToken: TokenConfig | null;
  activeTransaction: Transaction | null;
  bchAddress: string;
  evmAddress: string;
}

export const BridgeInterface = ({
  direction,
  selectedToken,
  activeTransaction,
  bchAddress,
  evmAddress
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
          {direction === TransactionType.DEPOSIT ? (
            <Deposit 
              selectedToken={selectedToken}
              transaction={activeTransaction}
              bchAddress={bchAddress}
              evmAddress={evmAddress}
            />
          ) : (
            <Withdraw 
              selectedToken={selectedToken}
              transaction={activeTransaction}
              bchAddress={bchAddress}
              evmAddress={evmAddress}
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