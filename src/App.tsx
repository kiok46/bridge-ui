import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Alert, AppBar, Box, Button, Container, Paper, Toolbar, Typography, Grid } from '@mui/material';
import { Deposit } from './deposit';
import { Withdraw } from './withdraw';
import Approval from './approval';
import Transactions from './transactions';
import { useUSDTBalance } from './balance';
import { WalletConnect } from './walletconnect';
import './App.css';

const useWallet = () => {
  const [userEVMAddress, setUserEVMAddress] = useState('');
  const [userBCHAddress, setUserBCHAddress] = useState('');
  const [network, setEVMNetwork] = useState('');
  const [depositTransactions, setDepositTransactions] = useState([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [activeDepositTransaction, setActiveDepositTransaction] = useState({});
  const [activeWithdrawTransaction, setActiveWithdrawTransaction] = useState({});


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/v1/bridge/transactions/?address=${userEVMAddress}`);
        const responseBCH = await axios.get(`http://localhost:4000/v1/bridge/transactions/?address=${userBCHAddress}`);
        if (response.data.success) {
          const deposits = response.data.data.deposits.map(deposit => ({
            id: deposit._id,
            type: 'Deposit',
            amount: deposit.amount,
            chainId: deposit.chainId,
            blockNumber: deposit.blockNumber,
            address: deposit.address,
            data: deposit.data,
            transactionHash: deposit.transactionHash,
            claimNFTIssuanceTransactionHash: deposit.claimNFTIssuanceTransactionHash,
            claimNFTBurnTransactionHash: deposit.claimNFTBurnTransactionHash
          }));
          const withdrawals = responseBCH.data.data.withdrawals.map(withdrawal => ({
            id: withdrawal._id,
            type: 'Withdrawal',
            amount: withdrawal.amount,
            chainId: withdrawal.chainId,
            blockNumber: withdrawal.blockNumber,
            address: withdrawal.address,
            data: withdrawal.data,
            transactionHash: withdrawal.transactionHash,
            exitId: withdrawal.exitId,
            exitIdTransactionHash: withdrawal.exitIdTransactionHash,
            processExitTransactionHash: withdrawal.processExitTransactionHash,
            signature: withdrawal.signature
          }));
          setDepositTransactions(deposits);
          setWithdrawalTransactions(withdrawals);

          console.log(deposits);
          console.log(withdrawals);

          setActiveDepositTransaction(deposits[0]);
          setActiveWithdrawTransaction(withdrawals[0]);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEVMAddress) {
      fetchTransactions();
    }
  }, [userEVMAddress]);

  useEffect(() => {
    const fetchUserEVMAddress = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          setUserEVMAddress(address);
          setEVMNetwork(network.name);
        } catch (error) {
          if (error.code === -32002) {
            alert('Connection request already pending. Please check your wallet.');
          } else if (error.code === 4001) {
            alert('Connection request rejected by user.');
          } else {
            console.error('Error fetching user address:', error);
            alert('Error fetching user address: ' + error.message);
          }
        }
      }
    };

    fetchUserEVMAddress();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        setUserEVMAddress(address);
        setEVMNetwork(network.name);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + error.message);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setUserEVMAddress('');
    setUserBCHAddress('');
    setEVMNetwork('');
  };

  const resetTransactions = () => {
    setActiveDepositTransaction({});
    setActiveWithdrawTransaction({});
  };

  return { userEVMAddress, userBCHAddress, setUserBCHAddress, network, connectWallet, disconnectWallet, depositTransactions, withdrawalTransactions, error, loading, activeDepositTransaction, activeWithdrawTransaction, setActiveDepositTransaction, setActiveWithdrawTransaction, resetTransactions };
};

function App() {
  const [selectedChain, setSelectedChain] = useState('sepolia');
  const [approvedAmount, setApprovedAmountCallback] = useState('1');
  const [direction, setDirection] = useState('toBCH');
  const { userEVMAddress, userBCHAddress, setUserBCHAddress, network, connectWallet, disconnectWallet, depositTransactions, withdrawalTransactions, error, loading, activeDepositTransaction, activeWithdrawTransaction, setActiveDepositTransaction, setActiveWithdrawTransaction, resetTransactions } = useWallet();
  const usdtBalance = useUSDTBalance();

  const handleTransactionButtonClick = (transaction) => {
    if (transaction.type === 'Deposit') {
      setActiveDepositTransaction(transaction);
    } else if (transaction.type === 'Withdrawal') {
      setActiveWithdrawTransaction(transaction);
    }
  };

  const handleBCHAddressChange = (address: string) => {
    setUserBCHAddress(address);
  };

  return (
    <Container maxWidth="lg" style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Cross-Chain Bridge
      </Typography>

      {/* Wallet Connection Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* EVM Network Connection Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
              EVM Network Connection
            </Typography>
            
            {userEVMAddress ? (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Network:</strong> {network}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2, wordBreak: 'break-all' }}>
                  <strong>Address:</strong> {userEVMAddress}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={disconnectWallet}
                  fullWidth
                >
                  Disconnect EVM Wallet
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Connect your MetaMask or other EVM wallet to start bridging tokens
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={connectWallet}
                  fullWidth
                >
                  Connect EVM Wallet
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* BCH Network Connection Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="secondary" sx={{ mb: 2 }}>
              BCH Network Connection
            </Typography>
            
            {userBCHAddress ? (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Network:</strong> Bitcoin Cash
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2, wordBreak: 'break-all' }}>
                  <strong>Address:</strong> {userBCHAddress}
                </Typography>
                <WalletConnect onBCHAddressChange={handleBCHAddressChange} />
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Connect your Bitcoin Cash wallet using WalletConnect
                </Typography>
                <WalletConnect onBCHAddressChange={handleBCHAddressChange} />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Bridge Interface */}
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6">Wrapped USDT on BCH: {usdtBalance}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Approval selectedChain={selectedChain} setApprovedAmountCallback={setApprovedAmountCallback} />
        </Grid>
      </Grid>

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
            onClick={resetTransactions}
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
              <Transactions transactions={depositTransactions} type="Deposit" onTransactionButtonClick={handleTransactionButtonClick} />
            </Box>
          </>
        ) : (
          <>
            <Withdraw 
              selectedChain={selectedChain}
              transaction={activeWithdrawTransaction}
            />
            <Box mt={3}>
              <Transactions transactions={withdrawalTransactions} type="Withdrawal" onTransactionButtonClick={handleTransactionButtonClick}/>
            </Box>
          </>
        )}

        <Alert severity="info" style={{ marginTop: '1rem' }}>
          Note: Bridging process may take 2 hours to 1 day to complete
        </Alert>
      </Paper>
    </Container>
  );
}
export default App;
