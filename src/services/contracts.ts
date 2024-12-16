import { ethers } from 'ethers';

export const getTokenContract = async (tokenAddress: string, provider: ethers.Provider) => {
  return new ethers.Contract(tokenAddress, [], provider);
}; 
