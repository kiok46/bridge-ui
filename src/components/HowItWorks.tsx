import React from 'react';
import { Box } from '@mui/material';
import { BridgeExplainer } from './bridge/BridgeExplainer';

const HowItWorks: React.FC = () => {
  return (
    <Box
      sx={{
        background: '#1B2030',
        minHeight: '100vh',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(130, 71, 229, 0.02) 0%, rgba(130, 71, 229, 0.01) 100%)',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <BridgeExplainer />
    </Box>
  );
};

export default HowItWorks; 
