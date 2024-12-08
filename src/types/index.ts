export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal';
  amount: string;
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
  status: 'pending' | 'completed' | 'failed';
  asset: string;
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal'
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