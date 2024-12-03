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

export const Withdraw = ({ selectedChain, transaction }: WithdrawProps) => {
  const [amount, setAmount] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Transfer to bridge contract', 'Start Exit', 'Waiting for approval', 'Process Exit'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
    <Box className="bridge-form" sx={{ width: '100%' }}>
      {!selectedChain ? (
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Please connect to a valid network.
        </Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Withdraw USDT
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
          />
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label} disabled={isStepDisabled(index)}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {index === 1 && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={startExit}
                        fullWidth
                        disabled={!!transaction?.exitId}
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
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={activeStep === steps.length - 1 || isStepDisabled(activeStep)}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </>
      )}
    </Box>
  );
}; 