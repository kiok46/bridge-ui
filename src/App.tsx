import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { BridgeInterface } from './components/bridge/BridgeInterface';
import { Transaction, TransactionStatus, TransactionType } from './types';
import { EVMWallet } from './components/wallet/EVMWallet';
import { BCHWallet } from './components/wallet/BCHWallet';
import { TokenBalance } from './components/balance/TokenBalance';
import { BridgeExplainer } from './components/bridge/BridgeExplainer';
import { ContractExplainer } from './components/bridge/ContractExplainer';
import TokenSelector from './components/TokenSelector';
import Transactions from './components/bridge/transactions/Transactions';
import { SUPPORTED_TOKENS } from './config/tokens';
import { BridgeDirection } from './components/bridge/BridgeDirection';
import Warning from '@mui/icons-material/Warning';


const defaultTransaction: Transaction = {
  _id: '',
  type: TransactionType.DEPOSIT,
  asset: '',
  amount: 1,
  createdAt: 0,
  status: TransactionStatus.PENDING,
  transactionHash: '',
  chainId: '',
  blockNumber: '',
  address: '',
  data: '',
  claimNFTIssuanceTransactionHash: '',
  claimNFTBurnTransactionHash: '',
  exitId: '',
  exitIdTransactionHash: '',
  processExitTransactionHash: '',
  signature: '',
  tokenConfig: null
}

export const App = () => {
  const [activeTransaction, setActiveTransaction] = useState<Transaction>(defaultTransaction);
  const [connectedBchAddress, setConnectedBchAddress] = useState<string | null>(null);
  const [connectedEvmAddress, setConnectedEvmAddress] = useState<string | null>(null);
  const [openExplainer, setOpenExplainer] = useState(false);
  const [openContractExplainer, setOpenContractExplainer] = useState(false);

  const handleTransactionInspect = (transaction: Transaction) => {
    if(transaction.asset){
      const token = SUPPORTED_TOKENS.find(token => token.symbol.toLowerCase() === transaction.asset.toLowerCase());
      if(token){
        const updatedTransaction = {
          ...transaction,
          tokenConfig: token
        };
        setActiveTransaction(updatedTransaction);
      }
    }
  };


  const onTransactionUpdate = (transaction: Transaction) => {
    setActiveTransaction(prevTransaction => ({
      ...prevTransaction,
      ...transaction
    }));
  };

  const onBCHAddressUpdate = (address: string) => {
    setConnectedBchAddress(address);
    if(activeTransaction.type === TransactionType.DEPOSIT){
      setActiveTransaction(prevTransaction => ({
        ...prevTransaction,
        data: address
      }));
    }

    if(activeTransaction.type === TransactionType.WITHDRAWAL){
      setActiveTransaction(prevTransaction => ({
        ...prevTransaction,
        address: address
      }));
    }
  };

  const onEVMAddressUpdate = (address: string) => {
    setConnectedEvmAddress(address);
    if(activeTransaction.type === TransactionType.DEPOSIT){
      setActiveTransaction(prevTransaction => ({
        ...prevTransaction,
        address: address
      }));
    }

    if(activeTransaction.type === TransactionType.WITHDRAWAL){
      setActiveTransaction(prevTransaction => ({
        ...prevTransaction,
        data: address
      }));
    }
  };

  return (
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Box
          sx={{
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            p: 2,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Warning sx={{ color: 'warning.main' }} />
          <Typography color="warning.main">
            This bridge is currently in development and not live yet. Please check back later.
          </Typography>
        </Box>
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
              <TokenSelector tokenConfig={activeTransaction.tokenConfig} onSelect={(token) => {
                  setActiveTransaction(prevTransaction => ({
                    ...prevTransaction,
                    tokenConfig: token
                  }));
                }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TokenBalance tokenConfig={activeTransaction.tokenConfig} />
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
                <EVMWallet tokenConfig={activeTransaction.tokenConfig} onAddressUpdate={onEVMAddressUpdate} />
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
                <BCHWallet onAddressUpdate={onBCHAddressUpdate} />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Transactions 
              connectedEvmAddress={connectedEvmAddress}
              connectedBchAddress={connectedBchAddress}
              onTransactionInspect={handleTransactionInspect}
            />
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
              <BridgeDirection 
                activeTransaction={activeTransaction} 
                onReset={() => setActiveTransaction({...defaultTransaction})} 
                onDirectionChange={(direction) => {
                  setActiveTransaction(prevTransaction => ({
                    ...prevTransaction,
                    type: direction
                  }));
                }}
              />
              <BridgeInterface
                activeTransaction={activeTransaction}
                connectedBchAddress={connectedBchAddress}
                connectedEvmAddress={connectedEvmAddress}
                onTransactionUpdate={onTransactionUpdate}
              />
            </Box>
          </Box>
        </Box>
        
      </Container>
  );
};

export default App;
