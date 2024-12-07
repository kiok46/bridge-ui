import { ethers } from 'ethers';

export const formatAmount = (amount: string, decimals: number): string => {
  return ethers.formatUnits(amount, decimals);
};

export const parseAmount = (amount: string, decimals: number): bigint => {
  return ethers.parseUnits(amount, decimals);
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