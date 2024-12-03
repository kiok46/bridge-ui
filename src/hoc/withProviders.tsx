import React from 'react';
import { ThemeProvider } from '@mui/material';
import { NotificationProvider } from '../contexts/NotificationContext';
import { WalletProvider } from '../contexts/WalletContext';
import { theme } from '../theme';

export const withProviders = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithProvidersComponent(props: P) {
    return (
      <WalletProvider>
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <WrappedComponent {...props} />
          </NotificationProvider>
        </ThemeProvider>
      </WalletProvider>
    );
  };
}; 