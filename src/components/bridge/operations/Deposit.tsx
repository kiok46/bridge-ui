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
  bchAddress: string;
  evmAddress: string;
}

export const Deposit = ({ selectedChain, transaction, bchAddress, evmAddress }: DepositProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bridgeStatus, setBridgeStatus] = useState('not-started');
  const [bridgedAmount, setBridgedAmount] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  const { checkAllowance, approve } = useApproval(selectedChain);
  
  const [depositData, setDepositData] = useState({
    amount: '1',
  });

  useEffect(() => {
    const checkApprovalNeeded = async () => {
      const allowance = await checkAllowance();
      console.log(Number(depositData.amount), Number(allowance))
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
      const bridgeTx = await bridgeContract.bridgeToBCH(amountToBridge, bchAddress);
      
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
    const value = e.target.value;
    // Only allow integers between 1-10000
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value);
      if (numValue >= 1 && numValue <= 10000) {
        setDepositData(prev => ({ ...prev, amount: value }));
      }
    }
  };

  const steps = [
    'Enter amount', 
    'Approve USDT', 
    'Send USDT to the bridge', 
    'Waiting for approval', 
    'Switch to BCH', 
    'Claim wUSDT'
  ];

  const stepDescriptions = [
    'Specify the amount of USDT you wish to bridge. Ensure the amount is between 1 and 10000. Additionally, provide your BCH address where the bridged tokens will be sent. It is better to connect to a BCH wallet as you will have to use the same addres to claim your tokens in the steps below. This address is crucial for the final step of claiming your tokens on the BCH network.',
    'Authorize the specified amount of USDT to be spent by the bridge contract. This step is necessary to allow the contract to move your tokens. If you have already approved the required amount, this step will be skipped automatically.',
    'Initiate the bridging process by moving your USDT to the bridge contract on the selected network. This step involves a blockchain transaction, so ensure you have enough ETH for gas fees. Note: Once you send the funds to the bridge, you can only get it back by completing the entire process and then bridging the funds back from BCH',
    'Once the bridging transaction is confirmed, a claimNFT will be issued to your provided BCH address. This NFT represents your claim to the bridged tokens. You will need to wait for a specified period before you can claim the wUSDT on the BCH network.',
    'Switch to the Bitcoin Cash network using your wallet. This step is necessary to interact with the BCH network and claim your tokens.',
    'Claim your wUSDT on the Bitcoin Cash network. Use the claimNFT issued in the previous step to receive your tokens. Ensure your BCH wallet is connected and ready to receive the tokens.'
  ];

  return (
    <Box 
      className="bridge-form" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
        backgroundColor: '#f7f9fc', // Aave's light background color
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // Aave's subtle shadow
      }}
    >
      <Stepper 
        activeStep={activeStep} 
        orientation="vertical"
        sx={{
          '.MuiStepLabel-label': {
            color: '#2a2a2a', // Aave's text color
            fontWeight: 'bold',
          },
          '.MuiStepContent-root': {
            borderLeft: '2px solid #e0e0e0', // Aave's border style
          }
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography 
                
                sx={{ 
                  mb: 5, 
                  padding: '0.5rem',
                  color: '#6c757d' // Aave's secondary text color
                }}
              >
                {stepDescriptions[index]}
              </Typography>
              
              {index === 0 && (
                <>
                  <TextField
                    type="text"
                    label="Enter amount (1-10000)"
                    value={depositData.amount}
                    onChange={handleAmountChange}
                    inputProps={{ 
                      pattern: "\\d*",
                      inputMode: "numeric"
                    }}
                    fullWidth
                    sx={{ 
                      marginBottom: '1rem', 
                      '& .MuiInputBase-root': {
                        backgroundColor: '#ffffff', // Aave's input background
                        borderRadius: '4px',
                      }
                    }}
                  />
                  {bchAddress ? (
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        padding: '1rem',
                        color: '#2a2a2a'
                      }}
                    >
                      {bchAddress}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: '#f8d7da',
                        borderRadius: '4px',
                        padding: '1rem',
                        color: '#721c24'
                      }}
                    >
                      Please connect your BCH wallet
                    </Typography>
                  )}
                </>
              )}

              {index === 1 && (
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleApprove}
                  disabled={!needsApproval}
                  fullWidth
                  sx={{
                    backgroundColor: needsApproval ? '#007bff' : '#6c757d', // Aave's button colors
                    '&:hover': {
                      backgroundColor: needsApproval ? '#0056b3' : '#5a6268',
                    }
                  }}
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
                  sx={{
                    backgroundColor: bridgeStatus === 'pending' ? '#6c757d' : '#007bff', // Aave's button colors
                    '&:hover': {
                      backgroundColor: bridgeStatus === 'pending' ? '#5a6268' : '#0056b3',
                    }
                  }}
                >
                  {bridgeStatus === 'pending' ? 'Bridging...' : 'Bridge USDT'}
                </Button>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button 
                  disabled={activeStep === 0} 
                  onClick={handleBack}
                  sx={{
                    color: '#007bff', // Aave's link color
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!depositData.amount || !bchAddress)) ||
                    (activeStep === 1 && needsApproval) ||
                    (activeStep === 2 && bridgeStatus !== 'completed')
                  }
                  sx={{
                    backgroundColor: '#007bff', // Aave's button color
                    '&:hover': {
                      backgroundColor: '#0056b3',
                    }
                  }}
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
        <Alert 
          severity="success" 
          sx={{ 
            textAlign: 'center',
            backgroundColor: '#d4edda', // Aave's success background color
            color: '#155724', // Aave's success text color
            borderRadius: '4px',
          }}
        >
          Successfully bridged {bridgedAmount} USDT
        </Alert>
      )}
    </Box>
  );
}; 