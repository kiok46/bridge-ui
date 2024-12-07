import { Box, TextField, Button, Alert, Stepper, Step, StepLabel, StepContent, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BRIDGE_ABI } from './contracts/abis/Bridge';
import { SUPPORTED_NETWORKS } from './config/networks';

export const Deposit = ({ selectedChain, approvedAmount, transaction }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTransaction, setActiveTransaction] = useState({
    transactionHash: '',
    chainId: '',
    blockNumber: '',
    address: '',
    data: '',
    claimNFTIssuanceTransactionHash: '',
    claimNFTBurnTransactionHash: '',
    exitId: '',
    exitIdTransactionHash: '',
    processExitTransactionHash: '',
    signature: '',
    amount: '1',
    bchAddress: '',
  });
  const [bridgeStatus, setBridgeStatus] = useState('not-started');
  const [bridgedAmount, setBridgedAmount] = useState(null);

  useEffect(() => {
    setActiveTransaction((prev) => ({
      ...prev,
      transactionHash: transaction?.transactionHash || '',
      chainId: transaction?.chainId || '',
      blockNumber: transaction?.blockNumber || '',
      address: transaction?.address || '',
      data: transaction?.data || '',
      claimNFTIssuanceTransactionHash: transaction?.claimNFTIssuanceTransactionHash || '',
      claimNFTBurnTransactionHash: transaction?.claimNFTBurnTransactionHash || '',
      exitId: transaction?.exitId || '',
      exitIdTransactionHash: transaction?.exitIdTransactionHash || '',
      processExitTransactionHash: transaction?.processExitTransactionHash || '',
      signature: transaction?.signature || '',
      amount: transaction?.amount ? ethers.formatUnits(transaction.amount, 6) : '1',
      bchAddress: transaction?.data || '',
    }));
  }, [transaction]);

  const bridge = async () => {
    try {
      setBridgeStatus('pending');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const bridgeContract = new ethers.Contract(SUPPORTED_NETWORKS[selectedChain].bridgeAddress, BRIDGE_ABI, signer);
      
      const amountToBridge = ethers.parseUnits(activeTransaction.amount, 6);
      const bridgeTx = await bridgeContract.bridgeToBCH(amountToBridge, activeTransaction.bchAddress);
      
      await bridgeTx.wait();
      setBridgeStatus('completed');
      setBridgedAmount(activeTransaction.amount);
    } catch (error) {
      console.error('Bridge error:', error);
      setBridgeStatus('not-started');
      alert('Error during bridge: ' + error.message);
    }
  };

  const steps = transaction?.claimNFTIssuanceTransactionHash ? [
    'Enter amount', 
    'Allowance', 
    'Approved', 
    'Switch to BCH', 
    'Claim wrapped token'
  ] : [
    'Enter amount', 
    'Allowance', 
    'Bridge', 
    'Waiting for approval', 
    'Switch to BCH', 
    'Claim wrapped token'
  ];

  const stepDescriptions = transaction?.claimNFTIssuanceTransactionHash ? [
    'Specify the amount of wrapped token to bridge and provide your BCH address.',
    'Authorize the token amount that can be spent by the contract.',
    `Transaction approved. Claim NFT Issuance Transaction Hash: ${transaction?.claimNFTIssuanceTransactionHash}`,
    'Switch to the Bitcoin Cash network to complete the process.',
    'Claim your wrapped token on the Bitcoin Cash network.'
  ] : [
    'Specify the amount of wrapped token to bridge and provide your BCH address.',
    'Authorize the token amount that can be spent by the contract.',
    'Move your wrapped token to the Contract on the selected network.',
    'A claimNFT will be issued to the provided BCH address, once the time has passed you can claim the wrapped token on the BCH network.',
    'Switch to the Bitcoin Cash network to complete the process.',
    'Claim your wrapped token on the Bitcoin Cash network.'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setActiveTransaction((prev) => ({ ...prev, amount: newAmount }));
    setActiveTransaction({ ...activeTransaction, amount: newAmount });
  };

  const handleBchAddressChange = (e) => {
    const newBchAddress = e.target.value;
    setActiveTransaction((prev) => ({ ...prev, bchAddress: newBchAddress }));
    setActiveTransaction({ ...activeTransaction, bchAddress: newBchAddress });
  };

  return (
    <Box className="bridge-form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} completed={transaction?.claimNFTBurnTransactionHash ? true : false}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography variant="caption" sx={{ mb: 2 }}>{stepDescriptions[index]}</Typography>
              {index === 0 && (
                <>
                  <TextField
                    type="number"
                    label="Enter amount (1-10000)"
                    value={activeTransaction.amount}
                    onChange={handleAmountChange}
                    inputProps={{ min: 1, max: 10000 }}
                    fullWidth
                    style={{ marginBottom: '1rem' }} // Add vertical space
                  />
                  <TextField
                    type="text"
                    label="Enter BCH address"
                    value={activeTransaction.bchAddress}
                    onChange={handleBchAddressChange}
                    fullWidth
                    required // Make BCH address required
                  />
                </>
              )}
              {index === 1 && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    {ethers.parseUnits(activeTransaction.amount, 6) > approvedAmount ? 'Amount exceeds approved limit. Please approve more wrapped Token.' : 'Amount is within approved limit.'} {approvedAmount}
                  </Typography>
                </>
              )}
              {index === 2 && !transaction?.claimNFTIssuanceTransactionHash && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={bridge}
                    disabled={!selectedChain || !activeTransaction.amount || parseFloat(activeTransaction?.amount) < 1 || parseFloat(activeTransaction?.amount) > 10000 || bridgeStatus === 'pending' || !activeTransaction.bchAddress}
                    fullWidth
                  >
                    {bridgeStatus === 'pending' ? 'Bridging...' : 'Bridge wUSDT'}
                  </Button>
                </>
              )}
              {index === 3 && transaction?.claimNFTIssuanceTransactionHash && (
                <>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Claim NFT Issuance Transaction Hash: {transaction?.claimNFTIssuanceTransactionHash}
                  </Typography>
                </>
              )}
              {index === 4 && transaction?.claimNFTBurnTransactionHash && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Claim wUSDT step is complete. Claim NFT Burn Transaction Hash: {transaction?.claimNFTBurnTransactionHash}
                </Typography>
              )}
              {index === 4 && !transaction?.claimNFTBurnTransactionHash && (
                <Button variant="outlined" color="secondary" fullWidth>
                  CTA
                </Button>
              )}
              {index === 5 && (
                <Button variant="outlined" color="secondary" fullWidth>
                  CTA
                </Button>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1 || !activeTransaction.amount || !activeTransaction.bchAddress}
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {bridgedAmount && (
        <Alert severity="success" sx={{ textAlign: 'center' }}>
          Successfully bridged {bridgedAmount} wUSDT
        </Alert>
      )}
    </Box>
  );
};
