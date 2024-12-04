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
  setNeedsApproval
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

      <BalanceDisplay 
        selectedChain={selectedChain}
        amount={amount}
        onApprovalComplete={() => setNeedsApproval(false)}
        needsApproval={needsApproval}
      />

      {direction === 'toBCH' ? (
        <>
          <Deposit 
            selectedChain={selectedChain}
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