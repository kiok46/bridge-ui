export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal';
  amount: string;
  chainId: string;
  blockNumber: number;
  address: string;
  data?: string;
  transactionHash: string;
  claimNFTIssuanceTransactionHash?: string;
  claimNFTBurnTransactionHash?: string;
  exitId?: string;
  exitIdTransactionHash?: string;
  processExitTransactionHash?: string;
  signature?: string;
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