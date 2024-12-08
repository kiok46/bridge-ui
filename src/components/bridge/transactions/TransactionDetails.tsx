import { Box, Typography, Link, Chip, Button } from '@mui/material';
import { Transaction } from '../../../types';
import { shortenAddress, getFormattedAmount } from '../../../utils/helpers';

interface TransactionDetailsProps {
  transaction: Transaction;
  explorerUrl: string;
  onInspect: () => void;
}

export const TransactionDetails = ({ transaction, explorerUrl, onInspect }: TransactionDetailsProps) => {
  const getStatusChip = () => {
    if (transaction.type === 'Deposit') {
      if (transaction.claimNFTBurnTransactionHash) {
        return <Chip label="Completed" sx={{ backgroundColor: '#2ebf6e', color: 'white' }} />;
      } else if (transaction.claimNFTIssuanceTransactionHash) {
        return <Chip label="Claim NFT Issued" sx={{ backgroundColor: '#B6509E', color: 'white' }} />;
      }
    } else {
      if (transaction.processExitTransactionHash) {
        return <Chip label="Completed" sx={{ backgroundColor: '#2ebf6e', color: 'white' }} />;
      } else if (transaction.exitIdTransactionHash) {
        return <Chip label="Exit Initiated" sx={{ backgroundColor: '#B6509E', color: 'white' }} />;
      }
    }
    return <Chip label="Pending" sx={{ backgroundColor: '#ffa726', color: 'white' }} />;
  };



  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="body2" sx={{ color: '#9BA1B3' }}>
            Block {transaction.blockNumber || 'Pending'}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#F1F1F3' }}>
            {getFormattedAmount(transaction)} {transaction.asset}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9BA1B3' }}>
            {shortenAddress(transaction.address || '')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onInspect && (
            <Button
              variant="contained"
              onClick={onInspect}
              sx={{
                backgroundColor: 'rgba(182, 80, 158, 0.15)',
                color: '#B6509E',
                '&:hover': {
                  backgroundColor: 'rgba(182, 80, 158, 0.25)'
                },
                textTransform: 'none',
                fontWeight: 500,
                height: '32px'
              }}
            >
              Inspect
            </Button>
          )}
          {getStatusChip()}
        </Box>
      </Box>
    </Box>
  );
};

export const TransactionDetailsDialog = ({ 
  transaction, 
  explorerUrl,
  onInspect
}: TransactionDetailsProps & { 
  onInspect: () => void;
}) => {

  return (
    <Box sx={{ 
      p: 4, 
      backgroundColor: '#0A0B0D',
      borderRadius: '6px'
    }}>
      <Box sx={{ mb: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#F1F1F3',
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            Overview
          </Typography>
          {onInspect && (
            <Button
              variant="contained"
              onClick={onInspect}
              sx={{
                backgroundColor: '#B6509E',
                '&:hover': {
                  backgroundColor: '#8F3F7B'
                },
                textTransform: 'none',
                fontWeight: 500,
                px: 4
              }}
            >
              Inspect
            </Button>
          )}
        </Box>
        <Box sx={{ 
          display: 'grid', 
          gap: 3,
          backgroundColor: '#13141A',
          borderRadius: '6px',
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <DetailItem 
            label="Status" 
            value={<StatusWithDescription transaction={transaction} />} 
          />
          <DetailItem 
            label="Type" 
            value={`${transaction.type === 'Deposit' ? 'Deposit' : 'Withdrawal'}`} 
          />
          <DetailItem 
            label="Amount" 
            value={`${getFormattedAmount(transaction)} ${transaction.asset}`} 
          />
          <DetailItem 
            label="Block Number" 
            value={transaction.blockNumber || 'Pending...'} 
          />
          <DetailItem 
            label="Chain ID" 
            value={transaction.chainId || 'Not available'} 
          />
          <DetailItem 
            label="Transaction Hash" 
            value={
              transaction.transactionHash ? (
                <Link 
                  href={`${explorerUrl}/tx/${transaction.transactionHash}`} 
                  target="_blank"
                  sx={{ 
                    color: '#8B3EEA', 
                    textDecoration: 'none',
                    '&:hover': { 
                      textDecoration: 'underline',
                      color: '#9B4EFA'
                    } 
                  }}
                >
                  {transaction.transactionHash}
                </Link>
              ) : 'Pending...'
            } 
          />
          <DetailItem 
            label="Address" 
            value={transaction.address || 'Not available'} 
          />
          {transaction.data && (
            <DetailItem 
              label="Data" 
              value={transaction.data} 
            />
          )}
          {transaction.signature && (
            <DetailItem 
              label="Signature" 
              value={transaction.signature} 
            />
          )}
        </Box>
      </Box>

      {transaction.type === 'Deposit' && (
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#F1F1F3', 
              mb: 3, 
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            Claim NFT Details
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            backgroundColor: '#13141A',
            borderRadius: '6px',
            p: 4,
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <DetailItem 
              label="Issuance Hash" 
              value={
                transaction.claimNFTIssuanceTransactionHash ? (
                  <Link 
                    href={`${explorerUrl}/tx/${transaction.claimNFTIssuanceTransactionHash}`} 
                    target="_blank"
                    sx={{ 
                      color: '#8B3EEA', 
                      textDecoration: 'none',
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#9B4EFA'
                      } 
                    }}
                  >
                    {transaction.claimNFTIssuanceTransactionHash}
                  </Link>
                ) : 'Pending...'
              } 
            />
            <DetailItem 
              label="Burn Hash" 
              value={
                transaction.claimNFTBurnTransactionHash ? (
                  <Link 
                    href={`${explorerUrl}/tx/${transaction.claimNFTBurnTransactionHash}`} 
                    target="_blank"
                    sx={{ 
                      color: '#8B3EEA', 
                      textDecoration: 'none',
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#9B4EFA'
                      } 
                    }}
                  >
                    {transaction.claimNFTBurnTransactionHash}
                  </Link>
                ) : 'Not burned yet'
              } 
            />
          </Box>
        </Box>
      )}

      {transaction.type === 'Withdrawal' && (
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#F1F1F3', 
              mb: 3, 
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            Exit Details
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gap: 3,
            backgroundColor: '#13141A',
            borderRadius: '6px',
            p: 4,
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <DetailItem 
              label="Exit ID" 
              value={transaction.exitId || 'Not generated yet'} 
            />
            <DetailItem 
              label="Exit Hash" 
              value={
                transaction.exitIdTransactionHash ? (
                  <Link 
                    href={`${explorerUrl}/tx/${transaction.exitIdTransactionHash}`} 
                    target="_blank"
                    sx={{ 
                      color: '#8B3EEA', 
                      textDecoration: 'none',
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#9B4EFA'
                      } 
                    }}
                  >
                    {transaction.exitIdTransactionHash}
                  </Link>
                ) : 'Pending...'
              } 
            />
            <DetailItem 
              label="Process Exit Hash" 
              value={
                transaction.processExitTransactionHash ? (
                  <Link 
                    href={`${explorerUrl}/tx/${transaction.processExitTransactionHash}`} 
                    target="_blank"
                    sx={{ 
                      color: '#8B3EEA', 
                      textDecoration: 'none',
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#9B4EFA'
                      } 
                    }}
                  >
                    {transaction.processExitTransactionHash}
                  </Link>
                ) : 'Not processed yet'
              } 
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ 
    display: 'grid', 
    gridTemplateColumns: '180px 1fr',
    gap: 2,
    alignItems: 'center'
  }}>
    <Typography sx={{ 
      color: '#6E7177',
      fontSize: '14px',
      fontWeight: 500
    }}>
      {label}
    </Typography>
    <Typography sx={{ 
      color: '#F1F1F3',
      fontSize: '14px',
      wordBreak: 'break-all'
    }}>
      {value}
    </Typography>
  </Box>
);

const StatusWithDescription = ({ transaction }: { transaction: Transaction }) => {
  const getStatusDetails = () => {
    if (transaction.type === 'Deposit') {
      if (transaction.claimNFTBurnTransactionHash) {
        return {
          label: "Completed",
          color: '#2ebf6e',
          description: "Transaction has been fully processed and funds are available"
        };
      } else if (transaction.claimNFTIssuanceTransactionHash) {
        return {
          label: "Claim NFT Issued",
          color: '#B6509E',
          description: "Claim NFT has been issued and is ready to be burned"
        };
      }
    } else {
      if (transaction.processExitTransactionHash) {
        return {
          label: "Completed",
          color: '#2ebf6e',
          description: "Withdrawal has been processed and funds are available"
        };
      } else if (transaction.exitIdTransactionHash) {
        return {
          label: "Exit Initiated",
          color: '#B6509E',
          description: "Exit process has started and is awaiting processing"
        };
      }
    }
    return {
      label: "Pending",
      color: '#ffa726',
      description: "Transaction is being processed"
    };
  };

  const status = getStatusDetails();

  return (
    <Box>
      <Chip 
        label={status.label} 
        sx={{ backgroundColor: status.color, color: 'white', mb: 1 }} 
      />
      <Typography variant="body2" sx={{ color: '#62677B' }}>
        {status.description}
      </Typography>
    </Box>
  );
}; 