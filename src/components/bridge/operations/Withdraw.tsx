import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent 
} from '@mui/material';
import { ethers } from 'ethers';
import { Transaction } from '../../../types';
import { bridgeAbi, BRIDGE_CONTRACT_ADDRESS } from '../../../constants';

interface WithdrawProps {
  selectedChain: string;
  transaction: Transaction | null;
  bchAddress: string;
  evmAddress: string;
}

const useStartExit = (amount: string, transactionHash: string) => {
  const [startExitStatus, setStartExitStatus] = useState<'not-started' | 'pending' | 'completed'>('not-started');
  const [startedExitAmount, setStartedExitAmount] = useState<string | null>(null);

  const startExit = async () => {
    try {
      setStartExitStatus('pending');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const bridgeContract = new ethers.Contract(BRIDGE_CONTRACT_ADDRESS, bridgeAbi, signer);
      
      const claimTx = await bridgeContract.claim(amount, transactionHash);
      
      await claimTx.wait();
      setStartExitStatus('completed');
      setStartedExitAmount(amount);
    } catch (error: any) {
      console.error('Claim error:', error);
      setStartExitStatus('not-started');
      alert('Error during claim: ' + error.message);
    }
  };

  return { startExitStatus, startedExitAmount, startExit };
};

export const Withdraw = ({ selectedChain, transaction, bchAddress, evmAddress }: WithdrawProps) => {
  const [amount, setAmount] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Transfer to bridge contract', 'Start Exit', 'Waiting for approval', 'Process Exit'];

  const stepDescriptions = [
    'Specify the amount of wUSDT you wish to withdraw. Ensure the amount is between 1 and 10000.',
    'Start the exit process by moving your wUSDT to the bridge contract on the selected network. This step involves a blockchain transaction, so ensure you have enough ETH for gas fees.',
    'Once the exit transaction is confirmed, you will need to wait for a specified period before you can claim your USDT on the selected network.',
    'Claim your USDT on the selected network. Use the exit transaction hash issued in the previous step to receive your tokens.'
  ];

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
        setAmount(value);
      }
    }
  };

  const isStepDisabled = (step: number) => {
    switch (step) {
      case 0:
        return !transaction?.transactionHash;
      case 1:
        return !transaction?.amount || !transaction?.exitId;
      case 2:
        return !transaction?.signature;
      case 3:
        return !transaction?.signature;
      default:
        return false;
    }
  };

  const { startExitStatus, startedExitAmount, startExit: startExitClaim } = useStartExit(
    transaction?.amount || '',
    transaction?.transactionHash || ''
  );

  const processExit = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bridgeContract = new ethers.Contract(BRIDGE_CONTRACT_ADDRESS, bridgeAbi, signer);
      const processExitTx = await bridgeContract.processExit(transaction!.exitId, transaction!.signature);
      await processExitTx.wait();
      console.log('Exit processed successfully');
    } catch (error: any) {
      console.error('Process Exit error:', error);
      alert('Error during process exit: ' + error.message);
    }
  };

  const startExit = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bridgeContract = new ethers.Contract(BRIDGE_CONTRACT_ADDRESS, bridgeAbi, signer);
      
      // First start the exit
      const startExitTx = await bridgeContract.startExit(transaction!.amount, transaction!.transactionHash);
      await startExitTx.wait();
      console.log('Exit started successfully');
      
      // Then claim it
      await startExitClaim();
      
    } catch (error: any) {
      console.error('Start Exit error:', error);
      alert('Error during start exit: ' + error.message);
    }
  };

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
            <Step key={label} disabled={isStepDisabled(index)}>
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
              {bchAddress}
              {evmAddress}

                {index === 0 && (
                  <TextField
                    type="text"
                    label="Enter amount (1-10000)"
                    value={amount}
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
                )}
                {index === 1 && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={startExit}
                      fullWidth
                      disabled={!!transaction?.exitId}
                      sx={{
                        backgroundColor: '#2a2a72', // Aave's primary button color
                        '&:hover': {
                          backgroundColor: '#1a1a5e',
                        },
                        borderRadius: '8px', // Rounded corners
                        padding: '0.5rem 1.5rem', // Padding for a more spacious button
                      }}
                    >
                      Start Exit
                    </Button>
                    {transaction?.exitId && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Exit ID: {transaction.exitId}
                      </Typography>
                    )}
                    {transaction?.exitIdTransactionHash && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Exit Transaction Hash: {transaction.exitIdTransactionHash}
                      </Typography>
                    )}
                    {startExitStatus === 'pending' && (
                      <Typography variant="body2" color="info" sx={{ mt: 1 }}>
                        Exit claim in progress...
                      </Typography>
                    )}
                    {startExitStatus === 'completed' && startedExitAmount && (
                      <Typography variant="body2" color="success" sx={{ mt: 1 }}>
                        Successfully claimed {ethers.formatUnits(startedExitAmount, 6)} USDT
                      </Typography>
                    )}
                  </>
                )}
                {index === 2 && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {transaction?.signature ? 
                      `Signature: ${transaction.signature}` :
                      'Waiting for approval signature...'
                    }
                  </Typography>
                )}
                {index === 3 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={processExit}
                    fullWidth
                    sx={{
                      backgroundColor: '#2a2a72', // Aave's primary button color
                      '&:hover': {
                        backgroundColor: '#1a1a5e',
                      },
                      borderRadius: '8px', // Rounded corners
                      padding: '0.5rem 1.5rem', // Padding for a more spacious button
                    }}
                  >
                    Process Exit
                  </Button>
                )}
                {index === 0 && transaction?.transactionHash && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Transaction Hash: {transaction.transactionHash}
                  </Typography>
                )}
                {index === 0 && transaction?.amount && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Transaction Amount: {ethers.formatUnits(transaction.amount, 6)} USDT
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button 
                    disabled={activeStep === 0} 
                    onClick={handleBack}
                    sx={{
                      color: '#2a2a72', // Aave's link color
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
                    color="primary"
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1 || isStepDisabled(activeStep)}
                    sx={{
                      backgroundColor: '#2a2a72', // Aave's primary button color
                      '&:hover': {
                        backgroundColor: '#1a1a5e',
                      },
                      borderRadius: '8px', // Rounded corners
                      padding: '0.5rem 1.5rem', // Padding for a more spacious button
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
    </Box>
  );
}; 