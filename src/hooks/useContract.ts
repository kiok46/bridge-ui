import { useState } from 'react';
import { ContractService } from '../services/contractService';
import { useNotificationHandlers } from './useNotificationContext';
import { useWalletEVM } from './useWalletEVM';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { parseAmount } from '../utils/helpers';

export const useContract = (network: string) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotificationHandlers();
  const { isConnected } = useWalletEVM();
  const contractService = new ContractService(network);

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    showError(error.message || message);
  };

  const ensureWalletConnected = () => {
    if (!isConnected) {
      throw new Error('Please connect your wallet first');
    }
  };

  const approve = async (amount: string) => {
    setLoading(true);
    try {
      ensureWalletConnected();
      await contractService.connect();
      const tx = await contractService.approveUSDT(parseAmount(amount));
      await tx.wait();
      showSuccess(SUCCESS_MESSAGES.APPROVAL_SUCCESS);
      return true;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.APPROVAL_FAILED);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deposit = async (amount: string) => {
    setLoading(true);
    try {
      ensureWalletConnected();
      await contractService.connect();
      const tx = await contractService.depositUSDT(parseAmount(amount));
      await tx.wait();
      showSuccess(SUCCESS_MESSAGES.DEPOSIT_SUCCESS);
      return true;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.DEPOSIT_FAILED);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: string) => {
    setLoading(true);
    try {
      ensureWalletConnected();
      await contractService.connect();
      const tx = await contractService.withdrawUSDT(parseAmount(amount));
      await tx.wait();
      showSuccess(SUCCESS_MESSAGES.WITHDRAW_SUCCESS);
      return true;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.WITHDRAW_FAILED);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    usdtContract: contractService,
    loading,
    approve,
    deposit,
    withdraw
  };
}; 