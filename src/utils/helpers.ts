import { ethers } from 'ethers';
import { decodeCashAddress, encodeCashAddress } from '@bitauth/libauth';
import { SUPPORTED_TOKENS } from '../config/tokens';
import { Transaction } from '../types';


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

export const getFormattedAmount = (transaction: Transaction) => {
  const token = SUPPORTED_TOKENS.find(t => 
    t.symbol.toLowerCase() === transaction.asset.toLowerCase() && 
    t.chainId === transaction.chainId.toString()
  );

  if (token) {
    return ethers.formatUnits(transaction.amount, token.decimals);
  }
  return transaction.amount;
};

export const toTokenAddress = (address: string) => {
  const addressInfo = decodeCashAddress(address);
  // @ts-ignore
  const pkhPayoutBin = addressInfo.payload;
  const prefix = "bitcoincash";
  const tokendata = encodeCashAddress({prefix, payload: pkhPayoutBin, type: "p2pkhWithTokens"});
  return tokendata.address;
}

export function reverseClaimCommitment(claimCommitment: string) {
  // Split the claimCommitment into two parts
  const amountHex = claimCommitment.slice(0, 16);
  const locktimeHex = claimCommitment.slice(16);

  // Function to reverse byte pairs and convert to integer
  const reverseAndConvert = (hexString) => {
    return BigInt('0x' + hexString.match(/.{2}/g).reverse().join(''));
  };

  // Reverse and convert each part
  const amount = reverseAndConvert(amountHex);
  const locktime = reverseAndConvert(locktimeHex);

  return { amount, locktime };
}