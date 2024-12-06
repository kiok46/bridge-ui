import { Box, Typography, Divider } from '@mui/material';

export const ContractExplainer = () => {
  const explainerContent = [
    {
      title: 'USDT Contract Overview',
      description: 'The USDT contract is a smart contract on the Ethereum blockchain that represents the Tether stablecoin. It allows users to hold and transfer USDT tokens, which are pegged to the value of the US dollar.'
    },
    {
      title: 'Key Functions',
      description: 'The USDT contract includes functions such as transfer, approve, and transferFrom. These functions allow users to send USDT to others, approve third parties to spend their USDT, and transfer USDT on behalf of others.'
    },
    {
      title: 'Security Features',
      description: 'The USDT contract includes security features such as pausing and blacklisting to protect users and the network. These features can be used to halt operations in case of emergencies or to prevent malicious activities.'
    }
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
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
        USDT Contract Explainer
      </Typography>
      {explainerContent.map((section, index) => (
        <Box key={index} sx={{ marginBottom: '1rem' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2a2a2a', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}
          >
            {section.title}
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
            {section.description}
          </Typography>
          {index < explainerContent.length - 1 && <Divider sx={{ marginY: '1rem' }} />}
        </Box>
      ))}
    </Box>
  );
}; 