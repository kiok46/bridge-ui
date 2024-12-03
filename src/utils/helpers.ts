import { ethers } from 'ethers';
import { USDT_DECIMALS } from './constants';

export const formatAmount = (amount: string): string => {
  return ethers.formatUnits(amount, USDT_DECIMALS);
};

export const parseAmount = (amount: string): bigint => {
  return ethers.parseUnits(amount, USDT_DECIMALS);
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const validateAmount = (amount: string, min: string, max: string): boolean => {
  const value = Number(amount);
  return value >= Number(min) && value <= Number(max);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 