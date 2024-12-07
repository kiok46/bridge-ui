import { Box, Button, Paper, Alert, Grid } from '@mui/material';
import { Deposit } from './operations/Deposit';
import { Withdraw } from './operations/Withdraw';
import { Transaction } from '../../types';
import { TokenConfig } from '../../types/tokens';

interface BridgeInterfaceProps {
  direction: 'toBCH' | 'toEVM';
  setDirection: (direction: 'toBCH' | 'toEVM') => void;
  selectedToken: TokenConfig | null;
  activeDepositTransaction: Transaction | null;
  activeWithdrawTransaction: Transaction | null;
  depositTransactions: Transaction[];
  withdrawalTransactions: Transaction[];
  bchAddress: string;
  evmAddress: string;
}

export const BridgeInterface = ({
  direction,
  setDirection,
  selectedToken,
  activeDepositTransaction,
  activeWithdrawTransaction,
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
          <Box display="flex" justifyContent="center" mb={2}>
            <Button 
              variant={direction === 'toBCH' ? 'contained' : 'outlined'}
              onClick={() => setDirection('toBCH')}
              sx={{ 
                marginRight: '1rem',
                backgroundColor: direction === 'toBCH' ? '#B6509E' : 'transparent',
                color: direction === 'toBCH' ? '#ffffff' : '#B6509E',
                borderColor: '#B6509E',
                '&:hover': {
                  backgroundColor: direction === 'toBCH' ? '#A3458C' : 'rgba(182, 80, 158, 0.1)',
                },
                borderRadius: '8px',
                padding: '0.5rem 1.5rem',
              }}
            >
              Deposit
            </Button>
            <Button 
              variant={direction === 'toEVM' ? 'contained' : 'outlined'}
              onClick={() => setDirection('toEVM')}
              sx={{
                backgroundColor: direction === 'toEVM' ? '#2EBAC6' : 'transparent',
                color: direction === 'toEVM' ? '#ffffff' : '#2EBAC6',
                borderColor: '#2EBAC6',
                '&:hover': {
                  backgroundColor: direction === 'toEVM' ? '#259DAF' : 'rgba(46, 186, 198, 0.1)',
                },
                borderRadius: '8px',
                padding: '0.5rem 1.5rem',
              }}
            >
              Withdraw
            </Button>
          </Box>

          {direction === 'toBCH' ? (
            <Deposit 
              selectedToken={selectedToken}
              transaction={activeDepositTransaction}
              bchAddress={bchAddress}
              evmAddress={evmAddress}
            />
          ) : (
            <Withdraw 
              selectedToken={selectedToken}
              transaction={activeWithdrawTransaction}
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