import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supportedNetworks, BRIDGE_CONTRACT_ADDRESS } from '../../utils/constants';
import { TextField, Button, Typography, Paper } from '@mui/material';

const useApproval = (selectedChain: string, amount: string) => {
  const [approvalStatus, setApprovalStatus] = useState('not-started');
  const [approvedAmount, setApprovedAmount] = useState(0);

  const checkAllowance = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const network = supportedNetworks.find(net => net.network === selectedChain);
      if (!network) {
        throw new Error('Unsupported network');
      }

      const tokenAbi = ["function allowance(address owner, address spender) view returns (uint256)"];
      const tokenContract = new ethers.Contract(network.usdtAddress, tokenAbi, signer);

      const ownerAddress = await signer.getAddress();
      const allowance = await tokenContract.allowance(ownerAddress, BRIDGE_CONTRACT_ADDRESS);

      setApprovedAmount(allowance);
      if (allowance >= ethers.parseUnits(amount, 6)) {
        setApprovalStatus('approved');
      } else {
        setApprovalStatus('not-started');
      }
    } catch (error) {
      console.error('Allowance check error:', error);
      alert('Error checking allowance: ' + error.message);
    }
  };

  useEffect(() => {
    if (amount) {
      checkAllowance();
    }
  }, [amount]);

  const approve = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }

      setApprovalStatus('pending');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const network = supportedNetworks.find(net => net.network === selectedChain);
      if (!network) {
        throw new Error('Unsupported network');
      }

      const tokenAbi = ["function approve(address spender, uint256 amount) returns (bool)"];
      const tokenContract = new ethers.Contract(network.usdtAddress, tokenAbi, signer);

      const amountToApprove = ethers.parseUnits(amount, 6);
      const approveTx = await tokenContract.approve(BRIDGE_CONTRACT_ADDRESS, amountToApprove);

      await approveTx.wait();
      setApprovalStatus('approved');
      setApprovedAmount(Number(amountToApprove));
    } catch (error) {
      console.error('Approval error:', error);
      setApprovalStatus('not-started');
      alert('Error during approval: ' + error.message);
    }
  };

  return { approvalStatus, approvedAmount: ethers.formatUnits(approvedAmount, 6), approve };
};

const Approval = ({ selectedChain, setApprovedAmountCallback }: { selectedChain: string, setApprovedAmountCallback: (amount: string) => void }) => {
  const [localAmount, setLocalAmount] = useState('1');
  const { approvalStatus, approvedAmount, approve } = useApproval(selectedChain, localAmount);

  useEffect(() => {
    setApprovedAmountCallback(approvedAmount.toString());
  }, [approvedAmount, setApprovedAmountCallback]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    if (Number(newAmount) >= 1) {
      setLocalAmount(newAmount);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
      <Typography variant="subtitle1" style={{ marginBottom: '1rem' }}>Approved Amount: {approvedAmount} USDT</Typography>
      <TextField
        type="number"
        label="Enter amount to approve"
        value={localAmount}
        onChange={handleAmountChange}
        inputProps={{ min: 1 }}
        fullWidth
        style={{ marginBottom: '1rem' }}
      />
      <Button 
        variant="contained"
        color="primary"
        onClick={approve}
        fullWidth
        disabled={approvalStatus === 'pending'}
      >
        {approvalStatus === 'pending' ? 'Approving...' : 'Approve'}
      </Button>
    </Paper>
  );
};

export default Approval;
