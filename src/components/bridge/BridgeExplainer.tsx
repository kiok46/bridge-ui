import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningIcon from '@mui/icons-material/Warning';
import { themeConstants } from '../../theme/constants';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeFiles } from '../../contracts/files';

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
      {step.steps && (
        <ul style={{ color: themeConstants.colors.text.secondary, fontSize: '0.875rem', lineHeight: 1.7, marginTop: '16px', marginBottom: '16px' }}>
          {step.steps.map((substep, idx) => (
            <li key={idx}>{substep}</li>
          ))}
        </ul>
      )}
      {step.code ? (
        <SyntaxHighlighter language="solidity" style={solarizedlight}>
          {step.code}
        </SyntaxHighlighter>
      ) : (
       <div></div>
      )}
      
      {step.info && (
        <InfoBox>
          <InfoOutlinedIcon sx={{ color: '#2EBAC6' }} />
          <Typography variant="body2" sx={{ color: themeConstants.colors.text.secondary }}>
            {step.info}
          </Typography>
        </InfoBox>
      )}

      {step.warning && (
        <WarningBox>
          <WarningIcon sx={{ color: themeConstants.colors.error.main }} />
          <Typography variant="body2" sx={{ color: themeConstants.colors.error.main }}>
            {step.warning}
          </Typography>
        </WarningBox>
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
  description?: string;
  steps?: string[];
  info?: string;
  warning?: string;
  code?: string;
}

export const BridgeExplainer = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section > div');
      let currentSection: string | null = null;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute('id');
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const aboutTheBridgeInfoSteps: Step[] = [
    {
      title: "Representation of Bridged Tokens on BCH",
      description: `Each newly supported token on the bridge needs to follow the same steps mentioned below.`,
      steps: [
        "Token Creation: A new category is created with max supply for a newly supported token, metadata is added and the entire amount is transferred to the contract as the 0th output of the transaction.",
        "AuthHead and Reserve Supply: Same UTXO acts as the AuthHead as well as Reserve Supply and never leaves the Contract.",
      ]
    },
    {
      title: "Lookup of BCH tokens on EVM",
      description: `The BCH tokenCategory is mapped to the EVM tokenAddress on the EVM side.`,
      steps: [
        "It would require 3 of 5 co-signers to approve addition or removal of any BCH tokenCategory to EVM tokenAddress mapping on the EVM side.",
      ]
    },
    {
      title: "Co-Signers",
      description: `The Bridge on both sides has a set number of co-signers responsible for approving the entry or exit of the bridge.`,
      steps: [
        "BCH to EVM: 3 of 5 MultiSig (Not finalised)",
        "EVM to BCH: 3 of 5 MultiSig (Not finalised)",
      ]
    },
    {
      title: "Deposit: EVM to BCH",
      description: ``,
      steps: [
        `The User transfers the token to the Bridge Contract on the EVM chain using the 'Deposit' function.
          The function has calldata attached which contains the Bitcoin Cash Address. The contract does a lookup for the BCH token category using the address of the token transferred to the contract, this category is used as part of the Deposit Event.
          `,
        "The co-signers subscribe to all the events from the EVM bridge contract, construct the transaction(Check the Transaction Structure below)",
        "The co-signers use an API to provide their signatures for the approval to the party managing the bridge UI",
        "Once enough signatures are collected, the user can sign and broadcast the transaction and get the tokens on the BCH network.",
      ],
      code: codeFiles.depositDescription.trim(),
      info: "The address(0) is considered the native token of the EVM chain"
    },
    {
      title: "Withdraw: BCH to EVM",
      description: "",
      steps: [
        "The User makes a token transaction transferring the tokens back to the bridge contract on the BCH network increasing it's reserve supply. (Check the Transaction Structure below)",
        "The co-signers subscribe to all the events from the BCH bridge contract address and sign the following (trasactionHash + chainId)",
        "Once enough signatures are collected, the user can broadcast the transaction on the Bridge Contract on the respective EVM chain and get the tokens.",
      ],
      code: codeFiles.withdrawDescription.trim(),
    },
  ];

  const depositSteps: Step[] = [
    {
      title: 'Connect & Select',
      description: 'Select the asset you wish to bridge to the BCH Blockchain. Connect to the source EVM chain along with the BCH network. The Interface helps you to connect with both chains using different wallets at the same time.',
      info: 'The connected BCH address will be used as the calldata for the deposit transaction',
      warning: 'If an Incorrect address is provided the funds will be lost forever'
    },
    {
      title: 'Enter Amount',
      description: 'Specify the amount of Token you wish to bridge to the BCH blockchain'
    },
    {
      title: 'Approve Token',
      description: 'Authorize the specified amount of Token to be spent by the bridge contract.',
      info: 'This step will be skipped if you have already approved the required amount'
    },
    {
      title: 'Send Token to the Bridge',
      description: 'Initiate the bridging process by moving your Token to the bridge contract on the selected network.',
      code: codeFiles.depositCallCode.trim(),
      warning: 'Ensure you have enough ETH for gas fees before proceeding'
    },
    {
      title: 'Waiting for Approval',
      description: 'As soon as the transaction is broadcasted, all the co-signers will become aware of the transaction. The co-signers will be using an API to provide their signatures of approval',
    },
    {
      title: 'Claim token',
      description: 'As soon as the min number of signatures required are collected the user can Broadcast the transaction.',
      info: 'The UI will provide you the all the information required to claim the tokens'
    }
  ];

  const withdrawSteps: Step[] = [
    {
      title: 'Connect & Select',
      description: 'Select the asset you wish to bridge to the EVM Blockchain. Connect to the source EVM chain along with the BCH network. The Interface helps you to connect with both chains using different wallets at the same time.',
      info: 'The connected EVM address and chainId will be used in the OP_RETURN for the withdraw transaction',
    },
    {
      title: 'Enter amount',
      description: 'Specify the amount of token you wish to withdraw.',
      warning: 'If the amount of token on the target blockchain is less than the amount of token you wish to withdraw, your withdraw process will be stuck and you will have to wait for the contract to have enough tokens'
    },
    {
      title: 'Sign and Broadcast',
      description: 'Sign and broadcast the transaction and wait for the approval',
    },
    {
      title: 'Waiting for Approval',
      description: 'As soon as the transaction is broadcasted, all the co-signers will become aware of the transaction. The co-signers will be using an API to provide their signatures of approval',
    },
    {
      title: 'Claim Token',
      description: 'As soon as the min number of signatures required are collected the user can Broadcast the transaction.',
      info: 'The UI will provide you the all the information required to claim the tokens'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6, display: 'flex', width: '100%', maxWidth: '100% !important' }}>
      <Box sx={{ width: '20%', pr: 4, position: 'sticky', top: '20px', alignSelf: 'flex-start' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Table of Contents
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', pl: 0 }}>
          <li>
            <a
              href="#about-the-bridge"
              style={{
                textDecoration: 'none',
                color: themeConstants.colors.text.primary,
              }}
            >
              About the Bridge
            </a>
            <ul>
              {aboutTheBridgeInfoSteps.map((step, index) => (
                <li key={index} style={{ marginTop: '4px' }}>
                  <a
                    href={`#about-the-bridge-step-${index}`}
                    style={{
                      textDecoration: 'none',
                      color: activeSection === `about-the-bridge-step-${index}` ? themeConstants.colors.primary.main : themeConstants.colors.text.secondary,
                    }}
                  >
                    {step.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <a
              href="#deposit-process"
              style={{
                textDecoration: 'none',
                color: themeConstants.colors.text.primary,
              }}
            >
              Deposit Process
            </a>
            <ul>
              {depositSteps.map((step, index) => (
                <li key={index} style={{ marginTop: '4px' }}>
                  <a
                    href={`#deposit-step-${index}`}
                    style={{
                      textDecoration: 'none',
                      color: activeSection === `deposit-step-${index}` ? themeConstants.colors.primary.main : themeConstants.colors.text.secondary,
                    }}
                  >
                    {step.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li style={{ marginTop: '10px' }}>
            <a
              href="#withdraw-process"
              style={{
                textDecoration: 'none',
                color: themeConstants.colors.text.primary,
              }}
            >
              Withdraw Process
            </a>
            <ul>
              {withdrawSteps.map((step, index) => (
                <li key={index} style={{ marginTop: '4px' }}>
                  <a
                    href={`#withdraw-step-${index}`}
                    style={{
                      textDecoration: 'none',
                      color: activeSection === `withdraw-step-${index}` ? themeConstants.colors.primary.main : themeConstants.colors.text.secondary,
                    }}
                  >
                    {step.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </Box>
      </Box>

      <Box sx={{ width: '80%', px: 0, mx: 0 }}>
        <DocSection elevation={0}>
          <DocTitle variant="h1">
            Bridge Documentation
          </DocTitle>
          <DocSubtitle>
            This bridge enables seamless token transfers between EVM networks and the Bitcoin Cash blockchain. The detailed instructions and processes for both deposits and withdrawals are provided below. Please read through each section carefully to understand the complete flow of bridging tokens between chains. Important information about security measures, transaction verification, co-signers and expected processing times are included in the step-by-step guides.
          </DocSubtitle>

          <section id="about-the-bridge">
            {aboutTheBridgeInfoSteps.map((step, index) => (
              <Box id={`about-the-bridge-step-${index}`} sx={{ mb: 4 }}>
                <StepContent step={step} index={index} />
              </Box>
            ))}
          </section>

          <section id="deposit-process">
            <SectionTitle variant="h2">
              Deposit Process
              <ArrowDownwardIcon color="primary" />
            </SectionTitle>
            {depositSteps.map((step, index) => (
              <StepContainer key={index} sx={{ display: 'flex', mb: 4 }} id={`deposit-step-${index}`}>
                <StepNumber>{index + 1}</StepNumber>
                <StepContent step={step} index={index} />
              </StepContainer>
            ))}
          </section>

          <section id="withdraw-process">
            <SectionTitle variant="h2">
              Withdraw Process
              <ArrowDownwardIcon color="primary" />
            </SectionTitle>
            {withdrawSteps.map((step, index) => (
              <StepContainer key={index} sx={{ display: 'flex', mb: 4 }} id={`withdraw-step-${index}`}>
                <StepNumber>{index + 1}</StepNumber>
                <StepContent step={step} index={index} />
              </StepContainer>
            ))}
          </section>
        </DocSection>
      </Box>
    </Container>
  );
}; 