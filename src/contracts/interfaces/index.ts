import { ethers } from 'ethers';

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface BridgeContract extends ethers.BaseContract {
  deposit: (amount: bigint) => Promise<ethers.ContractTransactionResponse>;
  withdraw: (amount: bigint) => Promise<ethers.ContractTransactionResponse>;
  claimNFT: (depositId: bigint) => Promise<ethers.ContractTransactionResponse>;
  processExit: (exitId: bigint) => Promise<ethers.ContractTransactionResponse>;
}

export interface TokenContract extends ethers.BaseContract {
  approve: (spender: string, amount: bigint) => Promise<ethers.ContractTransactionResponse>;
  allowance: (owner: string, spender: string) => Promise<bigint>;
  balanceOf: (account: string) => Promise<bigint>;
  transfer: (recipient: string, amount: bigint) => Promise<ethers.ContractTransactionResponse>;
} 