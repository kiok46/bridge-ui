import { Chain } from "../types/tokens";

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: '1',
    name: 'ETHEREUM',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014',
    bridgeAddress: '0x69fB183C10C546B734aFceC4ca6A5a8c5711b1f9'
  },
  {
    id: '137',
    name: 'POLYGON',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=014',
    bridgeAddress: '0x69fB183C10C546B734aFceC4ca6A5a8c5711b1f9'
  },
  {
    id: '11155111',
    name: 'SEPOLIA',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=014',
    bridgeAddress: '0x69fB183C10C546B734aFceC4ca6A5a8c5711b1f9'
  }
];