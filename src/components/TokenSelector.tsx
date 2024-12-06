import React from 'react';
import { Select, MenuItem, SelectChangeEvent, ListItemText, Box, Typography } from '@mui/material';

interface TokenSelectorProps {
  selectedToken: string;
  onChange: (event: SelectChangeEvent) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ selectedToken, onChange }) => {
  return (
    <Box>
      <Select
        value={selectedToken}
        onChange={onChange}
        variant="outlined"
        style={{
          width: '200px',
          margin: '10px',
          color: '#FFFFFF',
          backgroundColor: '#2C2F36',
          borderColor: '#B6509E',
        }}
        MenuProps={{
          PaperProps: {
            style: {
              backgroundColor: '#1B2030',
              color: '#FFFFFF',
            },
          },
        }}
      >
        <MenuItem value="USDT">
          <Box display="flex" alignItems="center">
            <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=014" alt="USDT" style={{ width: 24, height: 24, marginRight: 8 }} />
            <ListItemText primary="USDT" />
          </Box>
        </MenuItem>
        <MenuItem value="USDC">
          <Box display="flex" alignItems="center">
            <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=014" alt="USDC" style={{ width: 24, height: 24, marginRight: 8 }} />
            <ListItemText primary="USDC" />
          </Box>
        </MenuItem>
      </Select>
    </Box>
  );
};

export default TokenSelector; 