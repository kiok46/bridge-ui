import { useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { EVMWallet } from './components/wallet/EVMWallet';
import { BCHWallet } from './components/wallet/BCHWallet';
import { BridgeInterface } from './components/bridge/BridgeInterface';
import { BalanceDisplay } from './components/balance/BalanceDisplay';
import { useWallet } from './hooks/useWallet';
import { useUSDTBalance } from './hooks/useUSDTBalance';
import { Transaction } from './types';
import './App.css';

function App() {
  const [selectedChain, setSelectedChain] = useState('sepolia');
  const [approvedAmount, setApprovedAmountCallback] = useState('1');
  const [direction, setDirection] = useState<'toBCH' | 'toEVM'>('toBCH');
  const wallet = useWallet();
  const usdtBalance = useUSDTBalance();

  const handleTransactionButtonClick = (transaction) => {
    if (transaction.type === 'Deposit') {
      wallet.setActiveDepositTransaction(transaction);
    } else if (transaction.type === 'Withdrawal') {
      wallet.setActiveWithdrawTransaction(transaction);
    }
  };

  return (
    <Container maxWidth="lg" style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Cross-Chain Bridge
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <EVMWallet
            network={wallet.network}
            userEVMAddress={wallet.userEVMAddress}
            onConnect={wallet.connectWallet}
            onDisconnect={wallet.disconnectWallet}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BCHWallet
            userBCHAddress={wallet.userBCHAddress}
            onBCHAddressChange={wallet.setUserBCHAddress}
          />
        </Grid>
      </Grid>

      <BalanceDisplay 
        usdtBalance={usdtBalance.balance} 
        selectedChain={selectedChain}
        setApprovedAmountCallback={setApprovedAmountCallback}
      />

      <BridgeInterface
        direction={direction}
        setDirection={setDirection}
        selectedChain={selectedChain}
        approvedAmount={approvedAmount}
        activeDepositTransaction={wallet.activeDepositTransaction as Transaction}
        activeWithdrawTransaction={wallet.activeWithdrawTransaction as Transaction}
        depositTransactions={wallet.depositTransactions}
        withdrawalTransactions={wallet.withdrawalTransactions}
        onTransactionButtonClick={handleTransactionButtonClick}
        onReset={wallet.resetTransactions}
      />
    </Container>
  );
}

export default App;
