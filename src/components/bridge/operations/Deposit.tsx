import { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, Stepper, Step, StepLabel, StepContent, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { BRIDGE_ABI } from '../../../contracts/abis/Bridge';
import { Transaction, TransactionStatus } from '../../../types';
import { Approval } from '../../balance/Approval';
import { useWalletEVM } from '../../../hooks/useWalletEVM';
import { SUPPORTED_CHAINS } from '../../../config/chains';

interface DepositProps {
  transaction?: Transaction;
  connectedBchAddress: string;
  connectedEvmAddress: string;
}

export const Deposit = ({ transaction, connectedBchAddress, connectedEvmAddress }: DepositProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bridgeStatus, setBridgeStatus] = useState<TransactionStatus>(TransactionStatus.PENDING);
  const [bridgedAmount, setBridgedAmount] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState(false);
  const { getAllowance, approveToken } = useWalletEVM(transaction?.tokenConfig);
  
  const [depositAmount, setDepositAmount] = useState(1);

  useEffect(() => {
    const checkApprovalNeeded = async () => {
      if (!transaction?.tokenConfig) return;
      const chain = SUPPORTED_CHAINS.find(chain => chain.id === transaction.tokenConfig.chainId);
      if (!chain) {
        console.error('Chain not found for chainId:', transaction.tokenConfig.chainId);
        return;
      }
      const allowance = await getAllowance(connectedEvmAddress, chain.bridgeAddress);
      setNeedsApproval(Number(depositAmount) > Number(allowance));
    };

    if (depositAmount && transaction?.tokenConfig) {
      checkApprovalNeeded();
    }
  }, [depositAmount, getAllowance, transaction?.tokenConfig]);

  const handleApprove = async () => {
    if (!transaction?.tokenConfig) {
      alert('Please select a token first');
      return;
    }

    try {
      await approveToken(depositAmount.toString());
      setNeedsApproval(false);
      handleNext();
    } catch (error) {
      console.error('Approval error:', error);
      alert('Error during approval: ' + (error as Error).message);
    }
  };

  const bridge = async () => {
    if (!transaction?.tokenConfig) {
      return;
    }

    try {
      setBridgeStatus(TransactionStatus.PENDING);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const bridgeAddress = SUPPORTED_CHAINS.find(chain => chain.id === transaction.tokenConfig.chainId)?.bridgeAddress;
      const bridgeContract = new ethers.Contract(bridgeAddress, BRIDGE_ABI, signer);
      
      const amountToBridge = ethers.parseUnits(depositAmount.toString(), transaction.tokenConfig.decimals);
      const bridgeTx = await bridgeContract.bridgeToBCH(amountToBridge, connectedBchAddress);
      
      await bridgeTx.wait();
      setBridgeStatus(TransactionStatus.COMPLETED);
      setBridgedAmount(depositAmount.toString());
      handleNext();
    } catch (error) {
      console.error('Bridge error:', error);
      setBridgeStatus(TransactionStatus.FAILED);
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
        setDepositAmount(numValue);
      }
    }
  };

  const steps = [
    'Enter amount', 
    'Approve Token', 
    'Send Token to the bridge', 
    'Waiting for approval', 
    'Switch to BCH', 
    'Claim wrapped token'
  ];

  const stepDescriptions = [
    'Specify the amount of Token you wish to bridge. Ensure the amount is between 1 and 10000. Additionally, provide your BCH address where the bridged tokens will be sent. It is better to connect to a BCH wallet as you will have to use the same addres to claim your tokens in the steps below. This address is crucial for the final step of claiming your tokens on the BCH network.',
    'Authorize the specified amount of Token to be spent by the bridge contract. This step is necessary to allow the contract to move your tokens. If you have already approved the required amount, this step will be skipped automatically.',
    'Initiate the bridging process by moving your Token to the bridge contract on the selected network. This step involves a blockchain transaction, so ensure you have enough ETH for gas fees.',
    'Once the bridging transaction is confirmed, a claimNFT will be issued to your provided BCH address. This NFT represents your claim to the bridged tokens. You will need to wait for a specified period before you can claim the wUSDT on the BCH network.',
    'Switch to the Bitcoin Cash network using your wallet. This step is necessary to interact with the BCH network and claim your tokens.',
    'Claim your wrapped Token on the Bitcoin Cash network. Use the claimNFT issued in the previous step to receive your tokens. Ensure your BCH wallet is connected and ready to receive the tokens.'
  ];

  if (!transaction?.tokenConfig) {
    return (
      <Box sx={{ 
        backgroundColor: '#2C2F36',
        padding: '2rem',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
          Please select a token to continue
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      className="bridge-form" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
        backgroundColor: '#2C2F36',
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
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          '.MuiStepContent-root': {
            borderLeft: '2px solid #e0e0e0',
          }
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
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
                  color: '#FFFFFF' // White text
                }}
              >
                {stepDescriptions[index]}
              </Typography>
              
              {index === 0 && (
                <>
                  <TextField
                    type="text"
                    label="Enter amount (1-10000)"
                    value={depositAmount}
                    onChange={handleAmountChange}
                    inputProps={{ 
                      pattern: "\\d*",
                      inputMode: "numeric"
                    }}
                    fullWidth
                    sx={{ 
                      marginBottom: '1rem',
                      '& .MuiInputBase-root': {
                        backgroundColor: '#37474F',
                        borderRadius: '4px',
                        color: '#FFFFFF'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#FFFFFF'
                      }
                    }}
                  />
                  {connectedBchAddress ? (
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: '#37474F',
                        borderRadius: '4px',
                        padding: '1rem',
                        color: '#FFFFFF'
                      }}
                    >
                      {connectedBchAddress}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: '#37474F',
                        borderRadius: '4px',
                        padding: '1rem',
                        color: '#FF6B6B' // Error red
                      }}
                    >
                      Please connect your BCH wallet
                    </Typography>
                  )}
                </>
              )}

              {index === 1 && (
                <Button 
                  variant="outlined"
                  onClick={handleApprove}
                  disabled={!needsApproval}
                  fullWidth
                  sx={{
                    borderColor: needsApproval ? '#FFFFFF' : '#62677B',
                    color: needsApproval ? '#FFFFFF' : '#62677B',
                    '&:hover': {
                      borderColor: needsApproval ? '#2EBAC6' : '#62677B',
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
                  {needsApproval ? 'Approve USDT' : 'Already Approved'}
                </Button>
              )}

              {index === 2 && (
                <>
                  <Typography
                    variant="body2" 
                    sx={{
                      color: '#FF6B6B', // Error red
                      backgroundColor: '#37474F',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      borderRadius: '4px'
                    }}
                  >
                    Note: Once you send the funds to the bridge, you can only get it back by completing the entire process and then bridging the funds back from BCH
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={bridge}
                    disabled={bridgeStatus === 'pending'}
                    fullWidth
                    sx={{
                      borderColor: bridgeStatus === 'pending' ? '#6c757d' : '#FFFFFF',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: bridgeStatus === 'pending' ? '#5a6268' : '#2EBAC6',
                        backgroundColor: 'transparent',
                      }
                    }}
                  >
                    {bridgeStatus === 'pending' ? 'Bridging...' : 'Bridge Token'}
                  </Button>
                </>
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
                  disabled={
                    (activeStep === 0 && (!depositAmount || !connectedBchAddress)) ||
                    (activeStep === 1 && needsApproval) ||
                    (activeStep === 2 && bridgeStatus !== 'completed')
                  }
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
                  Next
                </Button>
              </Box>
              
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {needsApproval && transaction?.tokenConfig && (
        <Approval 
          tokenConfig={transaction.tokenConfig}
          amount={depositAmount.toString()}
          onApprovalComplete={() => setNeedsApproval(false)}
          address={connectedEvmAddress}
        />
      )}

      {bridgedAmount && (
        <Alert 
          severity="success" 
          sx={{ 
            textAlign: 'center',
            backgroundColor: '#37474F',
            color: '#4CAF50', // Success green
            borderRadius: '4px',
          }}
        >
          Successfully bridged {bridgedAmount} USDT
        </Alert>
      )}
    </Box>
  );
}; 