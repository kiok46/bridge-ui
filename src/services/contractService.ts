import { ethers } from 'ethers';
import { USDT_ABI } from '../contracts/abis/USDT';
import { BRIDGE_ABI } from '../contracts/abis/Bridge';
import { BridgeContract, USDTContract } from '../contracts/interfaces';
import { SUPPORTED_NETWORKS } from '../config/networks';

export class ContractService {
  private provider: ethers.BrowserProvider;
  private signer: ethers.Signer | null = null;
  private usdtContract: ethers.Contract | null = null;
  private network: string;

  constructor(network: string) {
    this.network = network;
    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  async connect() {
    if (!this.signer) {
      this.signer = await this.provider.getSigner();
      const usdtAddress = SUPPORTED_NETWORKS[this.network].contracts.USDT;
      this.usdtContract = new ethers.Contract(usdtAddress, USDT_ABI, this.signer);
    }
    return this.signer;
  }

  async getAllowance(owner: string, spender: string): Promise<bigint> {
    if (!this.usdtContract) {
      await this.connect();
    }
    return this.usdtContract!.allowance(owner, spender);
  }

  async approveToken(spender: string, amount: bigint): Promise<ethers.ContractTransactionResponse> {
    if (!this.usdtContract) {
      await this.connect();
    }
    return this.usdtContract!.approve(spender, amount);
  }

  async getUSDTContract(): Promise<USDTContract> {
    const network = SUPPORTED_NETWORKS[this.network];
    if (!network) throw new Error('Unsupported network');
    
    return new ethers.Contract(
      network.contracts.USDT,
      USDT_ABI,
      this.signer || this.provider
    ) as unknown as USDTContract;
  }

  async getBridgeContract(): Promise<BridgeContract> {
    const network = SUPPORTED_NETWORKS[this.network];
    if (!network) throw new Error('Unsupported network');
    
    return new ethers.Contract(
      network.contracts.Bridge,
      BRIDGE_ABI,
      this.signer || this.provider
    ) as unknown as BridgeContract;
  }

  async approveUSDT(amount: bigint): Promise<ethers.ContractTransactionResponse> {
    const usdt = await this.getUSDTContract();
    const network = SUPPORTED_NETWORKS[this.network];
    return usdt.approve(network.contracts.Bridge, amount);
  }

  async depositUSDT(amount: bigint): Promise<ethers.ContractTransactionResponse> {
    const bridge = await this.getBridgeContract();
    return bridge.deposit(amount);
  }

  async withdrawUSDT(amount: bigint): Promise<ethers.ContractTransactionResponse> {
    const bridge = await this.getBridgeContract();
    return bridge.withdraw(amount);
  }
} 