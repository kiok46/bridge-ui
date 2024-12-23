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
import { BRIDGE_ABI } from '../../../contracts/abis/Bridge';
import { SUPPORTED_CHAINS } from '../../../config/chains';

interface WithdrawProps {
  transaction: Transaction | null;
  connectedBchAddress: string;
  connectedEvmAddress: string;
}

const useStartExit = (selectedChain: string, amount: number, transactionHash: string) => {
  const [startExitStatus, setStartExitStatus] = useState<'not-started' | 'pending' | 'completed'>('not-started');
  const [startedExitAmount, setStartedExitAmount] = useState<number | null>(null);

  const startExit = async () => {
    try {
      setStartExitStatus('pending');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const bridgeContract = new ethers.Contract(SUPPORTED_CHAINS[selectedChain].bridgeAddress, BRIDGE_ABI, signer);
      
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

export const Withdraw = ({ transaction, connectedBchAddress, connectedEvmAddress }: WithdrawProps) => {
  const [amount, setAmount] = useState<number>(transaction?.amount || 1);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Transfer to bridge contract', 'Start Exit', 'Waiting for approval', 'Process Exit'];

  const stepDescriptions = [
    'Specify the amount of wrapped Token you wish to withdraw. Ensure the amount is between 1 and 10000.',
    'Start the exit process by moving your wrapped Token to the bridge contract on the selected network. This step involves a blockchain transaction, so ensure you have enough ETH for gas fees.',
    'Once the exit transaction is confirmed, you will need to wait for a specified period before you can claim your Token on the selected network.',
    'Claim your Token on the selected network. Use the exit transaction hash issued in the previous step to receive your tokens.'
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
        setAmount(numValue);
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
    transaction?.tokenConfig?.chainId || '',
    transaction?.amount || 1,
    transaction?.transactionHash || ''
  );

  const processExit = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bridgeContract = new ethers.Contract(SUPPORTED_CHAINS[transaction?.tokenConfig?.chainId || ''].bridgeAddress, BRIDGE_ABI, signer);
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
      const bridgeContract = new ethers.Contract(SUPPORTED_CHAINS[transaction?.tokenConfig?.chainId || ''].bridgeAddress, BRIDGE_ABI, signer);
      
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
        backgroundColor: '#2C2F36', // Darker background
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
      }}
    >
        <Stepper 
          activeStep={activeStep} 
          orientation="vertical"
          sx={{
            '.MuiStepLabel-label': {
              color: '#FFFFFF', // White text
              fontWeight: 'bold',
            },
            '.MuiStepContent-root': {
              borderLeft: '2px solid #e0e0e0', // Existing border style
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} disabled={isStepDisabled(index)}>
                          <StepLabel 
              sx={{
                '& .MuiStepLabel-label': {
                  color: '#FFFFFF', // White text
                  '&.Mui-active': {
                    color: '#2EBAC6', // Teal when active
                  },
                  '&.Mui-completed': {
                    color: '#B6509E', // Pink when completed
                  }
                },
                '& .MuiStepIcon-root': {
                  color: '#37474F', // Dark gray background
                  '&.Mui-active': {
                    color: '#2EBAC6', // Teal when active
                  },
                  '&.Mui-completed': {
                    color: '#B6509E', // Pink when completed
                  }
                }
              }}
            >
              {label}
            </StepLabel>
              <StepContent>
              <Typography 
                
                sx={{ 
                  mb: 5, 
                  padding: '0.5rem',
                  color: '#B0BEC5' // Lighter text color for better contrast
                }}
              >
                {stepDescriptions[index]}
              </Typography>
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
                        backgroundColor: '#37474F', // Darker input background
                        borderRadius: '4px',
                        color: '#FFFFFF' // White text for input
                      },
                      '& .MuiInputLabel-root': {
                        color: '#B0BEC5' // Lighter text color for label
                      }
                    }}
                  />
                )}
                {index === 1 && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={startExit}
                      fullWidth
                      disabled={!!transaction?.exitId}
                      sx={{
                        borderColor: '#FFFFFF',
                        color: '#FFFFFF',
                        '&:hover': {
                          borderColor: '#2EBAC6',
                          backgroundColor: 'transparent',
                        },
                        borderRadius: '12px',
                        padding: '0.5rem 1.5rem',
                      }}
                    >
                      Start Exit
                    </Button>
                    {transaction?.exitId && (
                      <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                        Exit ID: {transaction.exitId}
                      </Typography>
                    )}
                    {transaction?.exitIdTransactionHash && (
                      <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                        Exit Transaction Hash: {transaction.exitIdTransactionHash}
                      </Typography>
                    )}
                    {startExitStatus === 'pending' && (
                      <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                        Exit claim in progress...
                      </Typography>
                    )}
                    {startExitStatus === 'completed' && startedExitAmount && (
                      <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                        Successfully claimed {ethers.formatUnits(startedExitAmount, 6)} USDT
                      </Typography>
                    )}
                  </>
                )}
                {index === 2 && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                    {transaction?.signature ? 
                      `Signature: ${transaction.signature}` :
                      'Waiting for approval signature...'
                    }
                  </Typography>
                )}
                {index === 3 && (
                  <Button
                    variant="outlined"
                    onClick={processExit}
                    fullWidth
                    sx={{
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#2EBAC6',
                        backgroundColor: 'transparent',
                      },
                      borderRadius: '12px',
                      padding: '0.5rem 1.5rem',
                    }}
                  >
                    Process Exit
                  </Button>
                )}
                {index === 0 && transaction?.transactionHash && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                    Transaction Hash: {transaction.transactionHash}
                  </Typography>
                )}
                {index === 0 && transaction?.amount && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#B0BEC5' }}>
                    Transaction Amount: {ethers.formatUnits(transaction.amount, 6)} USDT
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button 
                    disabled={activeStep === 0} 
                    onClick={handleBack}
                    sx={{
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#2EBAC6',
                        backgroundColor: 'transparent',
                      },
                      '&:disabled': {
                        borderColor: '#62677B',
                        color: '#62677B',
                      },
                      borderRadius: '12px',
                      padding: '0.5rem 1.5rem',
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1 || isStepDisabled(activeStep)}
                    sx={{
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: '#2EBAC6',
                        backgroundColor: 'transparent',
                      },
                      '&:disabled': {
                        borderColor: '#62677B',
                        color: '#62677B',
                      },
                      borderRadius: '12px',
                      padding: '0.5rem 1.5rem',
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