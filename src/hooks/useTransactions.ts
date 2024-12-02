import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { fetchTransactions } from '../services/api';

export const useTransactions = (evmAddress: string, bchAddress: string) => {
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { deposits, withdrawals } = await fetchTransactions(evmAddress, bchAddress);
        setDeposits(deposits);
        setWithdrawals(withdrawals);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (evmAddress || bchAddress) {
      loadTransactions();
    }
  }, [evmAddress, bchAddress]);

  return { deposits, withdrawals, loading, error };
}; 