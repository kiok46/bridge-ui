import React from 'react';
import { Box, Button } from '@mui/material';

const TopNavBar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(31, 34, 44, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Box>
        <Button
          href="/"
          sx={{
            color: '#B6509E',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
              color: '#2EBAC6',
            },
          }}
        >
          Home
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          href="/how-it-works"
          target="_blank"
          sx={{
            color: '#B6509E',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
              color: '#2EBAC6',
            },
          }}
        >
          How It Works
        </Button>
      </Box>
    </Box>
  );
};

export default TopNavBar; 