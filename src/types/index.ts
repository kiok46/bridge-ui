import { TokenConfig } from "./tokens";

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  transactionHash?: string;
  chainId?: string;
  blockNumber?: string;
  address?: string;
  data?: string;
  claimNFTIssuanceTransactionHash?: string;
  claimNFTBurnTransactionHash?: string;
  exitId?: string;
  exitIdTransactionHash?: string;
  processExitTransactionHash?: string;
  signature?: string;
  createdAt: number; // Unix timestamp in seconds
  status: TransactionStatus;
  asset: string;
  tokenConfig: TokenConfig;
}

export interface WalletState {
  userEVMAddress: string;
  userBCHAddress: string;
  network: string;
  depositTransactions: Transaction[];
  withdrawalTransactions: Transaction[];
  error: string;
  loading: boolean;
  activeDepositTransaction: Transaction | null;
  activeWithdrawTransaction: Transaction | null;
} 