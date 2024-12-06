import { Box, Button, Paper, Alert } from '@mui/material';
import { Deposit } from './operations/Deposit';
import { Withdraw } from './operations/Withdraw';
import Transactions from './transactions/Transactions';
import { Transaction } from '../../types';
import { BalanceDisplay } from './BalanceDisplay';

interface BridgeInterfaceProps {
  direction: 'toBCH' | 'toEVM';
  setDirection: (direction: 'toBCH' | 'toEVM') => void;
  selectedChain: string;
  activeDepositTransaction: Transaction | null;
  activeWithdrawTransaction: Transaction | null;
  depositTransactions: Transaction[];
  withdrawalTransactions: Transaction[];
  onTransactionButtonClick: (transaction: Transaction) => void;
  onReset: () => void;
  amount: string;
  needsApproval: boolean;
  setNeedsApproval: React.Dispatch<React.SetStateAction<boolean>>;
  bchAddress: string;
  evmAddress: string;
}

export const BridgeInterface = ({
  direction,
  setDirection,
  selectedChain,
  activeDepositTransaction,
  activeWithdrawTransaction,
  depositTransactions,
  withdrawalTransactions,
  onTransactionButtonClick,
  onReset,
  amount,
  needsApproval,
  setNeedsApproval,
  bchAddress,
  evmAddress
}: BridgeInterfaceProps) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: '2rem', 
        marginBottom: '2rem',
        backgroundColor: '#f7f9fc', // Aave's light background color
        borderRadius: '12px', // Slightly more rounded corners
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Aave's subtle shadow
      }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Button 
          variant={direction === 'toBCH' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setDirection('toBCH')}
          sx={{ 
            marginRight: '1rem',
            backgroundColor: direction === 'toBCH' ? '#2a2a72' : 'transparent', // Aave's primary button color
            color: direction === 'toBCH' ? '#ffffff' : '#2a2a72', // Text color
            borderColor: '#2a2a72', // Border color for outlined
            '&:hover': {
              backgroundColor: direction === 'toBCH' ? '#1a1a5e' : '#f0f0f0',
            },
            borderRadius: '8px', // Rounded corners
            padding: '0.5rem 1.5rem', // Padding for a more spacious button
          }}
        >
          Deposit
        </Button>
        <Button 
          variant={direction === 'toEVM' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setDirection('toEVM')}
          sx={{
            backgroundColor: direction === 'toEVM' ? '#2a2a72' : 'transparent', // Aave's primary button color
            color: direction === 'toEVM' ? '#ffffff' : '#2a2a72', // Text color
            borderColor: '#2a2a72', // Border color for outlined
            '&:hover': {
              backgroundColor: direction === 'toEVM' ? '#1a1a5e' : '#f0f0f0',
            },
            borderRadius: '8px', // Rounded corners
            padding: '0.5rem 1.5rem', // Padding for a more spacious button
          }}
        >
          Withdraw
        </Button>
        {/* <Button 
          variant="outlined"
          color="secondary"
          onClick={onReset}
          sx={{ 
            marginLeft: '1rem',
            color: '#6c757d', // Aave's secondary button color
            borderColor: '#6c757d', // Border color for outlined
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            borderRadius: '8px', // Rounded corners
            padding: '0.5rem 1.5rem', // Padding for a more spacious button
          }}
        >
          Reset
        </Button> */}
      </Box>

      {direction === 'toBCH' ? (
        <>
          <Deposit 
            selectedChain={selectedChain}
            transaction={activeDepositTransaction}
            bchAddress={bchAddress}
            evmAddress={evmAddress}
          />
          <Box mt={3}>
            <Transactions 
              transactions={depositTransactions} 
              type="Deposit" 
              onTransactionButtonClick={onTransactionButtonClick} 
            />
          </Box>
        </>
      ) : (
        <>
          <Withdraw 
            selectedChain={selectedChain}
            transaction={activeWithdrawTransaction}
            bchAddress={bchAddress}
            evmAddress={evmAddress}
          />
          <Box mt={3}>
            <Transactions 
              transactions={withdrawalTransactions} 
              type="Withdrawal" 
              onTransactionButtonClick={onTransactionButtonClick}
            />
          </Box>
        </>
      )}

      <Alert 
        severity="info" 
        sx={{ 
          marginTop: '1rem',
          backgroundColor: '#e9ecef', // Aave's info background color
          color: '#0c5460', // Aave's info text color
          borderRadius: '8px', // Rounded corners
        }}
      >
        Note: Bridging process may take 2 hours to 1 day to complete
      </Alert>
    </Paper>
  );
}; 