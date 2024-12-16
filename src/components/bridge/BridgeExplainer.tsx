import { Box, Typography, Container, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningIcon from '@mui/icons-material/Warning';
import { alpha } from '@mui/material/styles';
import { themeConstants } from '../../theme/constants';

const DocSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: '24px',
  backgroundColor: 'rgba(31, 34, 44, 0.5)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const DocTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  fontSize: '2rem',
  background: 'linear-gradient(90deg, #B6509E 2%, #2EBAC6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const DocSubtitle = styled(Typography)(({ theme }) => ({
  color: themeConstants.colors.text.secondary,
  marginBottom: theme.spacing(6),
  fontSize: '1rem',
  maxWidth: '800px',
  lineHeight: 1.7,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: themeConstants.colors.text.primary,
  fontWeight: 500,
  marginBottom: theme.spacing(4),
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const StepContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:not(:last-child)::after': {
    content: '""',
    position: 'absolute',
    left: '24px',
    top: '48px',
    bottom: '-12px',
    width: '2px',
    background: 'rgba(255, 255, 255, 0.05)',
  }
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'linear-gradient(90deg, #B6509E 2%, #2EBAC6 100%)',
  color: themeConstants.colors.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 500,
  fontSize: '1rem',
  marginRight: theme.spacing(2),
}));

const StepContent = ({ step, index }: { step: Step; index: number }) => {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'rgba(38, 41, 51, 0.5)',
        borderRadius: '16px',
        padding: 3,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <StepTitle variant="h3">
        {step.title}
      </StepTitle>
      <StepDescription variant="body1">
        {step.description}
      </StepDescription>
      
      {step.warning && (
        <WarningBox>
          <WarningIcon sx={{ color: themeConstants.colors.error.main }} />
          <Typography variant="body2" sx={{ color: themeConstants.colors.error.main }}>
            {step.warning}
          </Typography>
        </WarningBox>
      )}
      
      {step.info && (
        <InfoBox>
          <InfoOutlinedIcon sx={{ color: '#2EBAC6' }} />
          <Typography variant="body2" sx={{ color: themeConstants.colors.text.secondary }}>
            {step.info}
          </Typography>
        </InfoBox>
      )}
    </Box>
  );
};

const StepTitle = styled(Typography)(({ theme }) => ({
  color: themeConstants.colors.text.primary,
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  fontSize: '1.1rem',
}));

const StepDescription = styled(Typography)(({ theme }) => ({
  color: themeConstants.colors.text.secondary,
  lineHeight: 1.7,
  fontSize: '0.875rem',
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: 'rgba(46, 186, 198, 0.05)',
  borderRadius: '8px',
  marginTop: theme.spacing(2),
}));

const WarningBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: themeConstants.colors.error.light,
  borderRadius: '8px',
  marginTop: theme.spacing(2),
}));

interface Step {
  title: string;
  description: string;
  info?: string;
  warning?: string;
}

export const BridgeExplainer = () => {
  const theme = useTheme();
  const depositSteps: Step[] = [
    {
      title: 'Select & Connect',
      description: 'Select the asset you wish to bridge to the BCH Blockchain. Connect to the source EVM chain.',
      info: 'Make sure you have enough native tokens (ETH, BNB, etc.) in your wallet to cover gas fees'
    },
    {
      title: 'Enter Amount',
      description: 'Specify the amount of Token you wish to bridge. Ensure the amount is between 1 and 10000. Additionally, provide your BCH address where the bridged tokens will be sent.',
      warning: 'Double-check your BCH address before proceeding. Using the same address for claiming tokens later will make the process smoother.'
    },
    {
      title: 'Approve Token',
      description: 'Authorize the specified amount of Token to be spent by the bridge contract.',
      info: 'This step will be skipped if you have already approved the required amount'
    },
    {
      title: 'Send Token to the Bridge',
      description: 'Initiate the bridging process by moving your Token to the bridge contract on the selected network.',
      warning: 'Ensure you have enough ETH for gas fees before proceeding'
    },
    {
      title: 'Waiting for Approval',
      description: 'Once the bridging transaction is confirmed, a claimNFT will be issued to your provided BCH address.',
      info: 'The waiting period is necessary for security purposes and typically takes a few minutes'
    },
    {
      title: 'Connect to BCH Wallet',
      description: 'Switch to the Bitcoin Cash network using your wallet.',
      info: 'Make sure you have a BCH wallet set up and ready to use'
    },
    {
      title: 'Claim wrapped token',
      description: 'Claim your wrapped token on the Bitcoin Cash network using the claimNFT.',
      warning: 'Keep your claimNFT safe - you will need it to receive your tokens'
    }
  ];

  const withdrawSteps: Step[] = [
    {
      title: 'Transfer to Bridge Contract',
      description: 'Specify the amount of wrapped token you wish to withdraw.',
      warning: 'Ensure the amount is between 1 and 10000'
    },
    {
      title: 'Start Exit',
      description: 'Start the exit process by moving your wrapped Token to the bridge contract.',
      info: 'Make sure you have enough BCH for transaction fees'
    },
    {
      title: 'Waiting for Approval',
      description: 'Once the exit transaction is confirmed, you will need to wait for a specified period.',
      info: 'The waiting period helps ensure the security of your transaction'
    },
    {
      title: 'Process Exit',
      description: 'Claim your Token on the selected network.',
      warning: 'Keep your exit transaction hash safe - you will need it to complete the process'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <DocSection elevation={0}>
        <DocTitle variant="h1">
          Bridge Documentation
        </DocTitle>
        <DocSubtitle>
          Learn how to bridge your tokens between networks securely and efficiently. Follow these step-by-step guides for depositing and withdrawing your assets.
        </DocSubtitle>

        <Box sx={{ mb: 8 }}>
          <SectionTitle variant="h2">
            Deposit Process
            <ArrowDownwardIcon color="primary" />
          </SectionTitle>
          {depositSteps.map((step, index) => (
            <StepContainer key={index} sx={{ display: 'flex', mb: 4 }}>
              <StepNumber>{index + 1}</StepNumber>
              <StepContent step={step} index={index} />
            </StepContainer>
          ))}
        </Box>

        <Box>
          <SectionTitle variant="h2">
            Withdraw Process
            <ArrowDownwardIcon color="primary" />
          </SectionTitle>
          {withdrawSteps.map((step, index) => (
            <StepContainer key={index} sx={{ display: 'flex', mb: 4 }}>
              <StepNumber>{index + 1}</StepNumber>
              <StepContent step={step} index={index} />
            </StepContainer>
          ))}
        </Box>
      </DocSection>
    </Container>
  );
}; 