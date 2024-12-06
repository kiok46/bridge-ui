import { Box, Button } from '@mui/material';

interface TopNavBarProps {
  onOpenExplainer: () => void;
  onOpenContractExplainer: () => void;
}

export const TopNavBar = ({ onOpenExplainer, onOpenContractExplainer }: TopNavBarProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(31, 34, 44, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Button
        variant="text"
        onClick={onOpenExplainer}
        sx={{
          color: '#B6509E',
          fontWeight: 'bold',
          textDecoration: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            color: '#2EBAC6',
          },
          marginRight: '1rem',
        }}
      >
        How does it work?
      </Button>
      <Button
        variant="text"
        onClick={onOpenContractExplainer}
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
        Contracts
      </Button>
    </Box>
  );
}; 