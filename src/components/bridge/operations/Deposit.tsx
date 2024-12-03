import { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, Stepper, Step, StepLabel, StepContent, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useApproval } from '../../../hooks/useApproval';
import { bridgeAbi, BRIDGE_CONTRACT_ADDRESS } from '../../../constants';
import { Transaction } from '../../../types';
import { Approval } from '../../balance/Approval';

interface DepositProps {
  selectedChain: string;
  transaction: Transaction | null;
}

export const Deposit = ({ selectedChain, transaction }: DepositProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bridgeStatus, setBridgeStatus] = useState('not-started');
  const [bridgedAmount, setBridgedAmount] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  const { checkAllowance, approve } = useApproval(selectedChain);
  
  const [depositData, setDepositData] = useState({
    amount: '1',
    bchAddress: '',
  });

  useEffect(() => {
    const checkApprovalNeeded = async () => {
      const allowance = await checkAllowance();
      setNeedsApproval(Number(depositData.amount) > Number(allowance));
    };

    if (depositData.amount) {
      checkApprovalNeeded();
    }
  }, [depositData.amount, checkAllowance]);

  const handleApprove = async () => {
    try {
      await approve(depositData.amount);
      setNeedsApproval(false);
      handleNext();
    } catch (error) {
      console.error('Approval error:', error);
      alert('Error during approval: ' + (error as Error).message);
    }
  };

  const bridge = async () => {
    try {
      setBridgeStatus('pending');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const bridgeContract = new ethers.Contract(BRIDGE_CONTRACT_ADDRESS, bridgeAbi, signer);
      
      const amountToBridge = ethers.parseUnits(depositData.amount, 6);
      const bridgeTx = await bridgeContract.bridgeToBCH(amountToBridge, depositData.bchAddress);
      
      await bridgeTx.wait();
      setBridgeStatus('completed');
      setBridgedAmount(depositData.amount);
      handleNext();
    } catch (error) {
      console.error('Bridge error:', error);
      setBridgeStatus('not-started');
      alert('Error during bridge: ' + (error as Error).message);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositData(prev => ({ ...prev, amount: e.target.value }));
  };

  const handleBchAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositData(prev => ({ ...prev, bchAddress: e.target.value }));
  };

  const steps = [
    'Enter amount', 
    'Approve USDT', 
    'Bridge', 
    'Waiting for approval', 
    'Switch to BCH', 
    'Claim wUSDT'
  ];

  const stepDescriptions = [
    'Specify the amount of USDT to bridge and provide your BCH address.',
    'Authorize the token amount that can be spent by the contract.',
    'Move your USDT to the Contract on the selected network.',
    'A claimNFT will be issued to the provided BCH address, once the time has passed you can claim the wUSDT on the BCH network.',
    'Switch to the Bitcoin Cash network to complete the process.',
    'Claim your wUSDT on the Bitcoin Cash network.'
  ];

  return (
    <Box className="bridge-form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography variant="caption" sx={{ mb: 2 }}>{stepDescriptions[index]}</Typography>
              
              {index === 0 && (
                <>
                  <TextField
                    type="number"
                    label="Enter amount (1-10000)"
                    value={depositData.amount}
                    onChange={handleAmountChange}
                    inputProps={{ min: 1, max: 10000 }}
                    fullWidth
                    style={{ marginBottom: '1rem' }}
                  />
                  <TextField
                    type="text"
                    label="Enter BCH address"
                    value={depositData.bchAddress}
                    onChange={handleBchAddressChange}
                    fullWidth
                    required
                  />
                </>
              )}

              {index === 1 && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleApprove}
                  disabled={!needsApproval}
                  fullWidth
                >
                  {needsApproval ? 'Approve USDT' : 'Already Approved'}
                </Button>
              )}

              {index === 2 && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={bridge}
                  disabled={bridgeStatus === 'pending'}
                  fullWidth
                >
                  {bridgeStatus === 'pending' ? 'Bridging...' : 'Bridge USDT'}
                </Button>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!depositData.amount || !depositData.bchAddress)) ||
                    (activeStep === 1 && needsApproval) ||
                    (activeStep === 2 && bridgeStatus !== 'completed')
                  }
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {needsApproval && (
        <Approval 
          selectedChain={selectedChain}
          amount={depositData.amount}
          onApprovalComplete={() => setNeedsApproval(false)}
        />
      )}

      {bridgedAmount && (
        <Alert severity="success" sx={{ textAlign: 'center' }}>
          Successfully bridged {bridgedAmount} USDT
        </Alert>
      )}
    </Box>
  );
}; 