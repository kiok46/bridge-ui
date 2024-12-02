import { Box, Button, Paper, Alert } from '@mui/material';
import { Deposit } from './operations/Deposit';
import { Withdraw } from './operations/Withdraw';
import Transactions from './transactions/Transactions';
import { Transaction } from '../../types';

interface BridgeInterfaceProps {
  direction: 'toBCH' | 'toEVM';
  setDirection: (direction: 'toBCH' | 'toEVM') => void;
  selectedChain: string;
  approvedAmount: string;
  activeDepositTransaction: Transaction;
  activeWithdrawTransaction: Transaction;
  depositTransactions: Transaction[];
  withdrawalTransactions: Transaction[];
  onTransactionButtonClick: (transaction: Transaction) => void;
  onReset: () => void;
}

export const BridgeInterface = ({
  direction,
  setDirection,
  selectedChain,
  approvedAmount,
  activeDepositTransaction,
  activeWithdrawTransaction,
  depositTransactions,
  withdrawalTransactions,
  onTransactionButtonClick,
  onReset
}: BridgeInterfaceProps) => {
  return (
    <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button 
          variant={direction === 'toBCH' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setDirection('toBCH')}
          style={{ marginRight: '1rem' }}
        >
          Deposit
        </Button>
        <Button 
          variant={direction === 'toEVM' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setDirection('toEVM')}
        >
          Withdraw
        </Button>
        <Button 
          variant="outlined"
          color="secondary"
          onClick={onReset}
          style={{ marginLeft: '1rem' }}
        >
          Reset
        </Button>
      </Box>

      {direction === 'toBCH' ? (
        <>
          <Deposit 
            selectedChain={selectedChain}
            approvedAmount={approvedAmount}
            transaction={activeDepositTransaction}
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

      <Alert severity="info" style={{ marginTop: '1rem' }}>
        Note: Bridging process may take 2 hours to 1 day to complete
      </Alert>
    </Paper>
  );
}; 