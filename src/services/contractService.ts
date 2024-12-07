import { ethers } from 'ethers';
import { TOKEN_ABI } from '../contracts/abis/Token';
import { BRIDGE_ABI } from '../contracts/abis/Bridge';
import { BridgeContract, TokenContract } from '../contracts/interfaces';
import { SUPPORTED_NETWORKS } from '../config/networks';

export class ContractService {
  private provider: ethers.BrowserProvider;
  private signer: ethers.Signer | null = null;
  private tokenContract: ethers.Contract | null = null;
  private network: string;

  constructor(network: string) {
    this.network = network;
    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  async connect() {
    if (!this.signer) {
      this.signer = await this.provider.getSigner();
      const tokenAddress = SUPPORTED_NETWORKS[this.network].contracts.USDT;
      this.tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, this.signer);
    }
    return this.signer;
  }

  async getAllowance(owner: string, spender: string): Promise<bigint> {
    if (!this.tokenContract) {
      await this.connect();
    }
    return this.tokenContract!.allowance(owner, spender);
  }

  async approveToken(spender: string, amount: bigint): Promise<ethers.ContractTransactionResponse> {
    if (!this.tokenContract) {
      await this.connect();
    }
    return this.tokenContract!.approve(spender, amount);
  }

  async getTokenContract(): Promise<TokenContract> {
    const network = SUPPORTED_NETWORKS[this.network];
    if (!network) throw new Error('Unsupported network');
    
    return new ethers.Contract(
      network.contracts.USDT,
      TOKEN_ABI,
      this.signer || this.provider
    ) as unknown as TokenContract;
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

  async depositToken(amount: bigint): Promise<ethers.ContractTransactionResponse> {
    const bridge = await this.getBridgeContract();
    return bridge.deposit(amount);
  }

  async withdrawToken(amount: bigint): Promise<ethers.ContractTransactionResponse> {
    const bridge = await this.getBridgeContract();
    return bridge.withdraw(amount);
  }
} 