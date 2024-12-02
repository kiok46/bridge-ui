import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Transaction } from '../types';

export const useWallet = () => {
  const [userEVMAddress, setUserEVMAddress] = useState('');
  const [userBCHAddress, setUserBCHAddress] = useState('');
  const [network, setEVMNetwork] = useState('');
  const [depositTransactions, setDepositTransactions] = useState<Transaction[]>([]);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeDepositTransaction, setActiveDepositTransaction] = useState<Transaction | {}>({});
  const [activeWithdrawTransaction, setActiveWithdrawTransaction] = useState<Transaction | {}>({});

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
          setActiveDepositTransaction(deposits[0] || {});
          setActiveWithdrawTransaction(withdrawals[0] || {});
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEVMAddress) {
      fetchTransactions();
    }
  }, [userEVMAddress, userBCHAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        setUserEVMAddress(address);
        setEVMNetwork(network.name);
      } catch (error: any) {
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

  return {
    userEVMAddress,
    userBCHAddress,
    setUserBCHAddress,
    network,
    connectWallet,
    disconnectWallet,
    depositTransactions,
    withdrawalTransactions,
    error,
    loading,
    activeDepositTransaction,
    activeWithdrawTransaction,
    setActiveDepositTransaction,
    setActiveWithdrawTransaction,
    resetTransactions
  };
}; 