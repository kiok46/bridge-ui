export const BRIDGE_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function claimNFT(uint256 depositId) external",
  "function processExit(uint256 exitId) external",
  "event Deposit(address indexed user, uint256 amount, uint256 depositId)",
  "event Withdrawal(address indexed user, uint256 amount, uint256 exitId)",
  "event ClaimNFTIssued(uint256 indexed depositId, address indexed user)",
  "event ExitProcessed(uint256 indexed exitId, address indexed user)"
]; 