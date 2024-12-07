import { Box, Typography, Divider } from '@mui/material';

export const BridgeExplainer = () => {
  const depositSteps = [
    {
      title: 'Enter Amount',
      description: 'Specify the amount of Token you wish to bridge. Ensure the amount is between 1 and 10000. Additionally, provide your BCH address where the bridged tokens will be sent. It is better to connect to a BCH wallet as you will have to use the same address to claim your tokens in the steps below. This address is crucial for the final step of claiming your tokens on the BCH network.'
    },
    {
      title: 'Approve Token',
      description: 'Authorize the specified amount of Token to be spent by the bridge contract. This step is necessary to allow the contract to move your tokens. If you have already approved the required amount, this step will be skipped automatically.'
    },
    {
      title: 'Send Token to the Bridge',
      description: 'Initiate the bridging process by moving your Token to the bridge contract on the selected network. This step involves a blockchain transaction, so ensure you have enough ETH for gas fees.'
    },
    {
      title: 'Waiting for Approval',
      description: 'Once the bridging transaction is confirmed, a claimNFT will be issued to your provided BCH address. This NFT represents your claim to the bridged tokens. You will need to wait for a specified period before you can claim the wUSDT on the BCH network.'
    },
    {
      title: 'Switch to BCH',
      description: 'Switch to the Bitcoin Cash network using your wallet. This step is necessary to interact with the BCH network and claim your tokens.'
    },
    {
      title: 'Claim wrapped token',
      description: 'Claim your wrapped token on the Bitcoin Cash network. Use the claimNFT issued in the previous step to receive your tokens. Ensure your BCH wallet is connected and ready to receive the tokens.'
    }
  ];

  const withdrawSteps = [
    {
      title: 'Transfer to Bridge Contract',
      description: 'Specify the amount of wrapped token you wish to withdraw. Ensure the amount is between 1 and 10000.'
    },
    {
      title: 'Start Exit',
      description: 'Start the exit process by moving your wrappde Token to the bridge contract on the selected network. This step involves a blockchain transaction, so ensure you have enough ETH for gas fees.'
    },
    {
      title: 'Waiting for Approval',
      description: 'Once the exit transaction is confirmed, you will need to wait for a specified period before you can claim your Token on the selected network.'
    },
    {
      title: 'Process Exit',
      description: 'Claim your Token on the selected network. Use the exit transaction hash issued in the previous step to receive your tokens.'
    }
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem', 
        backgroundColor: '#f7f9fc', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#2a2a2a', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}
      >
        Bridging Process Overview
      </Typography>

      <Typography 
        variant="h5" 
        sx={{ 
          color: '#2a2a2a', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}
      >
        Deposit Process
      </Typography>
      {depositSteps.map((step, index) => (
        <Box key={index} sx={{ marginBottom: '1rem' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2a2a2a', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}
          >
            {step.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6c757d', 
              padding: '0.5rem', 
              backgroundColor: '#ffffff', 
              borderRadius: '4px' 
            }}
          >
            {step.description}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ marginY: '1rem' }} />

      <Typography 
        variant="h5" 
        sx={{ 
          color: '#2a2a2a', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}
      >
        Withdraw Process
      </Typography>
      {withdrawSteps.map((step, index) => (
        <Box key={index} sx={{ marginBottom: '1rem' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2a2a2a', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}
          >
            {step.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6c757d', 
              padding: '0.5rem', 
              backgroundColor: '#ffffff', 
              borderRadius: '4px' 
            }}
          >
            {step.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}; 