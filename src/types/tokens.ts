export interface TokenConfig {
  symbol: string;
  name: string;
  icon: string;
  chainId: string;
  address: string;
  decimals: number;
  minAmount: string;
  maxAmount: string;
}

export interface Chain {
  id: string;
  name: string;
  icon: string;
} 