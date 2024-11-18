import React from 'react';
import { Box, Typography, List, Button, Paper } from '@mui/material';

export const TransactionDetails = ({ transaction }) => (
  <>
    {transaction.transactionHash && <Typography variant="body2">Transaction Hash: {transaction.transactionHash}</Typography>}
    {transaction.chainId && <Typography variant="body2">Chain ID: {transaction.chainId}</Typography>}
    {transaction.blockNumber && <Typography variant="body2">Block Number: {transaction.blockNumber}</Typography>}
    {transaction.address && <Typography variant="body2">Address: {transaction.address}</Typography>}
    {transaction.data && <Typography variant="body2">Data: {transaction.data}</Typography>}
    {transaction.claimNFTIssuanceTransactionHash && <Typography variant="body2">Claim NFT Issuance Transaction Hash: {transaction.claimNFTIssuanceTransactionHash}</Typography>}
    {transaction.claimNFTBurnTransactionHash && <Typography variant="body2">Claim NFT Burn Transaction Hash: {transaction.claimNFTBurnTransactionHash}</Typography>}
    {transaction.exitId && <Typography variant="body2">Exit ID: {transaction.exitId}</Typography>}
    {transaction.exitIdTransactionHash && <Typography variant="body2">Exit ID Transaction Hash: {transaction.exitIdTransactionHash}</Typography>}
    {transaction.processExitTransactionHash && <Typography variant="body2">Process Exit Transaction Hash: {transaction.processExitTransactionHash}</Typography>}
    {transaction.signature && <Typography variant="body2">Signature: {transaction.signature}</Typography>}
  </>
);

export const TransactionCard = ({ transaction, type, onTransactionButtonClick }) => (
  <Paper key={transaction.id} elevation={3} style={{ marginBottom: '1rem', padding: '1rem' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1">
        {`${transaction.type} - ${(transaction.amount / 10**6).toFixed(6)} wUSDT`}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => onTransactionButtonClick(transaction, type)}>
        View
      </Button>
    </Box>
    <TransactionDetails transaction={transaction} />
  </Paper>
);

const Transactions = ({ transactions, type, onTransactionButtonClick }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <List>
        {transactions.map((transaction) => (
          <TransactionCard 
            key={transaction.id}
            transaction={transaction} 
            type={type} 
            onTransactionButtonClick={onTransactionButtonClick} 
          />
        ))}
      </List>
    </Box>
  );
};

export default Transactions;
