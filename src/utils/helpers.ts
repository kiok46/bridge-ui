import { ethers } from 'ethers';

export const formatAmount = (amount: string, decimals: number): string => {
  return ethers.formatUnits(amount, decimals);
};

export const parseAmount = (amount: string, decimals: number): bigint => {
  return ethers.parseUnits(amount, decimals);
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 12)}...${address.slice(-12)}`;
};

export const validateAmount = (amount: string, min: string, max: string): boolean => {
  const value = Number(amount);
  return value >= Number(min) && value <= Number(max);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatDate = (timestamp: number | string) => {
  // Convert string to number if needed
  const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  
  // If timestamp is in seconds (less than year 2100), convert to milliseconds
  const milliseconds = timestampNum < 4102444800 ? timestampNum * 1000 : timestampNum;
  
  return new Date(milliseconds).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 