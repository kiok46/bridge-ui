import { TokenConfig, Chain } from '../types/tokens';
import { ethers } from 'ethers';

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: '1',
    name: 'ETHEREUM',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014'
  },
  {
    id: '137',
    name: 'POLYGON',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=014'
  },
  {
    id: '11155111',
    name: 'SEPOLIA',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014'
  }
];

// Helper function to get chain name
const getChainName = (chainId: string): string => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId)?.name || chainId;
};

export const SUPPORTED_TOKENS: TokenConfig[] = [
  {
    symbol: 'TestToken',
    name: `TestToken on ${getChainName('11155111')}`,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014',
    chainId: '11155111',
    address: '0x0ea37B93D683FcD2BC50c0B365D4619f8bA10108',
    decimals: 18,
    minAmount: ethers.parseUnits('0.01', 18).toString(),  // 0.01 TestToken
    maxAmount: ethers.parseUnits('1000', 18).toString()   // 1000 TestToken
  },
  {
    symbol: 'USDT',
    name: `USDT on ${getChainName('1')}`,
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=014',
    chainId: '1',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    minAmount: ethers.parseUnits('1', 6).toString(),      // 1 USDT
    maxAmount: ethers.parseUnits('100000', 6).toString()  // 100,000 USDT
  },
  {
    symbol: 'USDT',
    name: `USDT on ${getChainName('137')}`,
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=014',
    chainId: '137',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    decimals: 6,
    minAmount: ethers.parseUnits('1', 6).toString(),      // 1 USDT
    maxAmount: ethers.parseUnits('100000', 6).toString()  // 100,000 USDT
  },
  {
    symbol: 'ETH',
    name: `ETH on ${getChainName('1')}`,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014',
    chainId: '1',
    address: ethers.ZeroAddress,
    decimals: 18,
    minAmount: ethers.parseUnits('0.01', 18).toString(),  // 0.01 ETH
    maxAmount: ethers.parseUnits('100', 18).toString()    // 100 ETH
  },
  {
    symbol: 'WETH',
    name: `WETH on ${getChainName('137')}`,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014',
    chainId: '137',
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    decimals: 18,
    minAmount: ethers.parseUnits('0.01', 18).toString(),  // 0.01 WETH
    maxAmount: ethers.parseUnits('100', 18).toString()    // 100 WETH
  },
  {
    symbol: 'USDT',
    name: `USDT on ${getChainName('11155111')}`,
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=014',
    chainId: '11155111',
    address: '0x6175a8471C2122f778445e7E07A164250a19E661',
    decimals: 6,
    minAmount: ethers.parseUnits('1', 6).toString(),      // 1 USDT
    maxAmount: ethers.parseUnits('10000', 6).toString()   // 10,000 USDT
  },
];

// Helper function to group tokens by symbol
export const groupedTokens = SUPPORTED_TOKENS.reduce((acc, token) => {
  if (!acc[token.symbol]) {
    acc[token.symbol] = [];
  }
  acc[token.symbol].push(token);
  return acc;
}, {} as Record<string, TokenConfig[]>);
