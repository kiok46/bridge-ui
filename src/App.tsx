import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Dialog, DialogContent, DialogTitle, Paper } from '@mui/material';
import { BridgeInterface } from './components/bridge/BridgeInterface';
import { Transaction } from './types';
import { EVMWallet } from './components/wallet/EVMWallet';
import { BCHWallet } from './components/wallet/BCHWallet';
import { TokenBalance } from './components/balance/TokenBalance';
import { BridgeExplainer } from './components/bridge/BridgeExplainer';
import { ContractExplainer } from './components/bridge/ContractExplainer';
import { TopNavBar } from './components/TopNavBar';
import TokenSelector from './components/TokenSelector';
import { TokenConfig } from './types/tokens';
import Transactions from './components/bridge/transactions/Transactions';

export const App = () => {
  const [direction, setDirection] = useState<'toBCH' | 'toEVM'>('toBCH');
  const [amount, setAmount] = useState('0');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [activeDepositTransaction, setActiveDepositTransaction] = useState<Transaction | null>(null);
  const [activeWithdrawTransaction, setActiveWithdrawTransaction] = useState<Transaction | null>(null);
  const [depositTransactions, setDepositTransactions] = useState<Transaction[]>([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState<Transaction[]>([]);
  const [bchAddress, setBchAddress] = useState<string | null>(null);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [openExplainer, setOpenExplainer] = useState(false);
  const [openContractExplainer, setOpenContractExplainer] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenConfig | null>(null);

  const handleTransactionButtonClick = (transaction: Transaction) => {
    if (transaction.type === 'Deposit') {
      setActiveDepositTransaction(transaction);
    } else {
      setActiveWithdrawTransaction(transaction);
    }
  };

  const handleReset = () => {
    setActiveDepositTransaction(null);
    setActiveWithdrawTransaction(null);
    setAmount('0');
  };

  const handleTokenChange = (token: TokenConfig) => {
    setSelectedToken(token);
  };

  return (
    <Box
      sx={{
        background: '#1B2030',
        minHeight: '100vh',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(130, 71, 229, 0.02) 0%, rgba(130, 71, 229, 0.01) 100%)',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <TopNavBar
        onOpenExplainer={() => setOpenExplainer(true)}
        onOpenContractExplainer={() => setOpenContractExplainer(true)}
      />

      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Box
          sx={{
            borderRadius: '24px',
            background: 'rgba(31, 34, 44, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            p: { xs: 2, md: 4 },
            mb: 4,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              background: 'linear-gradient(90deg, #B6509E 0%, #2EBAC6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}
          >
            Cross-Chain Bridge
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4,
              p: 2,
              backgroundColor: 'rgba(38, 41, 51, 0.7)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ flex: 1, mr: 2 }}>
              <TokenSelector selectedToken={selectedToken} onSelect={handleTokenChange} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TokenBalance selectedToken={selectedToken} />
            </Box>  
          </Box>  

          <Dialog open={openExplainer} onClose={() => setOpenExplainer(false)} fullWidth maxWidth="md">
            <DialogTitle>Bridging Process Overview</DialogTitle>
            <DialogContent>
              <BridgeExplainer />
            </DialogContent>
          </Dialog>

          <Dialog open={openContractExplainer} onClose={() => setOpenContractExplainer(false)} fullWidth maxWidth="md">
            <DialogTitle>Token Contract Explainer</DialogTitle>
            <DialogContent>
              <ContractExplainer />
            </DialogContent>
          </Dialog>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: '16px',
                  background: 'rgba(38, 41, 51, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <EVMWallet selectedToken={selectedToken} onAddressUpdate={setEvmAddress} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: '16px',
                  background: 'rgba(38, 41, 51, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <BCHWallet onAddressUpdate={setBchAddress} />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 4 }}>
            {/* <Paper
              elevation={3}
              sx={{
                padding: '1.25rem',
                height: '400px',
                backgroundColor: '#1B2030',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                color: '#FFFFFF',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            > */}
              <Transactions 
                evmAddress={evmAddress}
                bchAddress={bchAddress}
                onTransactionButtonClick={handleTransactionButtonClick}
              />
            {/* </Paper> */}
          </Box>

          <Box
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: '-2px',
                borderRadius: '24px',
                padding: '2px',
                background: 'linear-gradient(90deg, #B6509E 0%, #2EBAC6 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }
            }}
          >
            <Box
              sx={{
                borderRadius: '22px',
                background: 'rgba(38, 41, 51, 0.95)',
                backdropFilter: 'blur(10px)',
                p: { xs: 2, md: 3 },
              }}
            >
              <BridgeInterface
                selectedToken={selectedToken}
                direction={direction}
                setDirection={setDirection}
                activeDepositTransaction={activeDepositTransaction}
                activeWithdrawTransaction={activeWithdrawTransaction}
                depositTransactions={depositTransactions}
                withdrawalTransactions={withdrawalTransactions}
                bchAddress={bchAddress}
                evmAddress={evmAddress}
              />
            </Box>
          </Box>
        </Box>
        
      </Container>
    </Box>
  );
};

export default App;
