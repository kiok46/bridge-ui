import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { SUPPORTED_NETWORKS } from '../../config/networks';

interface NetworkSelectorProps {
  selectedChain: string;
  onNetworkChange: (network: string) => void;
}

export const NetworkSelector = ({ selectedChain, onNetworkChange }: NetworkSelectorProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Network</InputLabel>
      <Select
        value={selectedChain}
        label="Network"
        onChange={(e) => onNetworkChange(e.target.value)}
      >
        {Object.entries(SUPPORTED_NETWORKS).map(([key, network]) => (
          <MenuItem key={key} value={key}>
            {network.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}; 