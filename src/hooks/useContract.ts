import { useState } from 'react';
import { ContractService } from '../services/contractService';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { parseAmount } from '../utils/helpers';

export const useContract = (network: string) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const contractService = new ContractService(network);

  const handleError = (error: any, message: string) => {
    console.error(message, error);
    showNotification({
      type: 'error',
      message: error.message || message
    });
  };

  const approve = async (amount: string) => {
    setLoading(true);
    try {
      await contractService.connect();
      const tx = await contractService.approveUSDT(parseAmount(amount));
      await tx.wait();
      showNotification({
        type: 'success',
        message: SUCCESS_MESSAGES.APPROVAL_SUCCESS
      });
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
      await contractService.connect();
      const tx = await contractService.depositUSDT(parseAmount(amount));
      await tx.wait();
      showNotification({
        type: 'success',
        message: SUCCESS_MESSAGES.DEPOSIT_SUCCESS
      });
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
      await contractService.connect();
      const tx = await contractService.withdrawUSDT(parseAmount(amount));
      await tx.wait();
      showNotification({
        type: 'success',
        message: SUCCESS_MESSAGES.WITHDRAW_SUCCESS
      });
      return true;
    } catch (error) {
      handleError(error, ERROR_MESSAGES.WITHDRAW_FAILED);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    approve,
    deposit,
    withdraw
  };
}; 