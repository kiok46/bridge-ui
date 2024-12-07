import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Theme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { groupedTokens } from '../config/tokens';
import { SUPPORTED_CHAINS } from '../config/chains';
import type { TokenConfig } from '../types/tokens';
import { themeConstants } from '../theme/constants';

const SearchTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: themeConstants.colors.text.primary,
    backgroundColor: themeConstants.colors.background.card,
    borderRadius: themeConstants.borderRadius.medium,
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  '& .MuiInputAdornment-root': {
    color: themeConstants.colors.text.secondary,
  },
  '& input::placeholder': {
    color: themeConstants.colors.text.secondary,
    opacity: 1,
  },
}));

interface TokenSelectorProps {
  selectedToken?: TokenConfig;
  onSelect: (token: TokenConfig) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ selectedToken, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroupedTokens = useMemo(() => {
    if (!searchQuery) return groupedTokens;

    const searchLower = searchQuery.toLowerCase();
    
    return Object.entries(groupedTokens).reduce((acc, [symbol, tokens]) => {
      const filteredTokens = tokens.filter(token => 
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower)
      );

      if (filteredTokens.length > 0) {
        acc[symbol] = filteredTokens;
      }

      return acc;
    }, {} as Record<string, TokenConfig[]>);
  }, [searchQuery]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
  };

  const handleSelect = (token: TokenConfig) => {
    onSelect(token);
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '8px 12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: themeConstants.borderRadius.medium,
          cursor: 'pointer',
          backgroundColor: themeConstants.colors.background.card,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {selectedToken ? (
          <>
            <img
              src={selectedToken.icon}
              alt={selectedToken.symbol}
              style={{ width: 24, height: 24 }}
            />
            <Box>
              <Typography sx={{ color: themeConstants.colors.text.primary }}>
                {selectedToken.symbol}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: themeConstants.colors.text.secondary,
                  display: 'block',
                  fontSize: '0.75rem'
                }}
              >
                on {SUPPORTED_CHAINS.find(chain => chain.id === selectedToken.chainId)?.name}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography sx={{ color: themeConstants.colors.text.secondary }}>
            Select Token
          </Typography>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: themeConstants.colors.background.dark,
            borderRadius: themeConstants.borderRadius.large,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            color: themeConstants.colors.text.primary,
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Typography variant="h6">Select a token</Typography>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              color: themeConstants.colors.text.secondary,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ p: 3 }}>
          <SearchTextField
            fullWidth
            placeholder="Search token name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <List sx={{ mt: 2 }}>
            {Object.entries(filteredGroupedTokens).map(([symbol, tokens]) => (
              <Box key={symbol} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: themeConstants.colors.text.secondary,
                    px: 2,
                    mb: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {symbol}
                </Typography>
                {tokens.map((token) => (
                  <ListItem
                    key={`${token.symbol}-${token.chainId}`}
                    onClick={() => handleSelect(token)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: themeConstants.colors.background.card,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      borderRadius: themeConstants.borderRadius.medium,
                      mb: 1,
                      padding: '12px',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={token.icon}
                          alt={token.symbol}
                          style={{ width: 32, height: 32 }}
                        />
                        <img
                          src={SUPPORTED_CHAINS.find(chain => chain.id === token.chainId)?.icon}
                          alt={token.chainId}
                          style={{
                            width: 16,
                            height: 16,
                            position: 'absolute',
                            right: -4,
                            bottom: -4,
                            borderRadius: '50%',
                            backgroundColor: themeConstants.colors.background.dark,
                            padding: 2,
                          }}
                        />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: themeConstants.colors.text.primary }}>
                          {token.symbol}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          sx={{ color: themeConstants.colors.text.secondary }}
                        >
                          on {SUPPORTED_CHAINS.find(chain => chain.id === token.chainId)?.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </Box>
            ))}
          </List>
        </Box>
      </Dialog>
    </>
  );
};

export default TokenSelector; 