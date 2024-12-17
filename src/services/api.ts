import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/v1/bridge';

export const fetchTransactions = async (evmAddress: string, bchAddress: string) => {
  const [evmResponse, bchResponse] = await Promise.all([
    axios.get(`${API_BASE_URL}/transactions/?address=${evmAddress}`),
    axios.get(`${API_BASE_URL}/transactions/?address=${bchAddress}`)
  ]);

  return {
    deposits: evmResponse.data.data.deposits,
    withdrawals: bchResponse.data.data.withdrawals
  };
}; 