import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { fetchTransactions } from '../services/api';

export const useTransactions = (evmAddress: string, bchAddress: string) => {
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!evmAddress && !bchAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { deposits: newDeposits, withdrawals: newWithdrawals } = await fetchTransactions(evmAddress, bchAddress);
      
      // Sort transactions by creation date in descending order (newest first)
      setDeposits(newDeposits.sort((a, b) => b.createdAt - a.createdAt));
      setWithdrawals(newWithdrawals.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [evmAddress, bchAddress]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const refresh = useCallback(() => {
    loadTransactions();
  }, [loadTransactions]);

  return { 
    deposits, 
    withdrawals, 
    loading, 
    error,
    refresh 
  };
}; 