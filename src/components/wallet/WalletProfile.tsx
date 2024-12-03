import React from 'react';
import { Grid } from '@mui/material';
import { EVMWallet } from './EVMWallet';
import { BCHWallet } from './BCHWallet';
import { useWalletContext } from '../../hooks/useWalletContext';

export const WalletProfile = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <EVMWallet />
      </Grid>
      <Grid item xs={12} md={6}>
        <BCHWallet />
      </Grid>
    </Grid>
  );
}; 