import ISSUER_ABI from '../contracts/abis/bch/issuer';
import BRIDGE_ABI from '../contracts/abis/bch/bridge';
import { ElectrumNetworkProvider } from 'cashscript';
import { Contract, AddressType, HashType, SignatureTemplate, TokenDetails, Utxo } from 'cashscript';
import { reverseClaimCommitment, toTokenAddress } from './helpers';
import { cashAddressToLockingBytecode, decodeTransaction } from '@bitauth/libauth';
import { hexToBin } from '@bitauth/libauth';


interface ElectrumTokenData {
  amount: string;
  category: string;
  nft?: {
    capability: string;
    commitment: string;
  }
}

interface ElectrumUTXO {
  tx_hash: string;
  tx_pos: number;
  height: number;
  value: number;
  token_data?: ElectrumTokenData;
}


// export interface Utxo {
//   txid: string;
//   vout: number;
//   satoshis: bigint;
//   token?: TokenDetails;
// }

// export interface TokenDetails {
//   amount: bigint;
//   category: string;
//   nft?: {
//       capability: 'none' | 'mutable' | 'minting';
//       commitment: string;
//   };
// }

const ownerPkh = 'b50bbbabc937c8cb7a54375f0f5d73f8a6a0628f';
const bridgeTokenCategoryNonReversed = '71d29d5239b908fe6996d97680fd2fb9a69596806b25f22ddd223ca58f4767f5'
const claimTokenCategoryNonReversed = '8b5e273114a5002d914d68cd8ff90b0f38afc3827ca2a7ffa91fce26432f4c3d'

let bridgeTokenCategory = '';
let claimTokenCategory = '';


const setCategories = (bridgeTokenCategoryNonReversed, claimTokenCategoryNonReversed) => {
  bridgeTokenCategory = bridgeTokenCategoryNonReversed
    .match(/.{2}/g) // Split into byte pairs
    .reverse()      // Reverse the byte pairs
    .join('');

  claimTokenCategory = claimTokenCategoryNonReversed
    .match(/.{2}/g) // Split into byte pairs
    .reverse()      // Reverse the byte pairs
    .join('');
}

setCategories(bridgeTokenCategoryNonReversed, claimTokenCategoryNonReversed);

export const getBridgeContract = () => {
  const provider = new ElectrumNetworkProvider();
  const addressType: AddressType = 'p2sh32';
  const options = { provider, addressType }  
  return new Contract(BRIDGE_ABI, [bridgeTokenCategory, claimTokenCategory], options);
}

export const getIssuerContract = () => {
  const provider = new ElectrumNetworkProvider();
  const addressType: AddressType = 'p2sh32';
  const options = { provider, addressType }  
  return new Contract(ISSUER_ABI, [ownerPkh, claimTokenCategory, BigInt(0)], options);
}


export const claimTokenTransaction = async (contract, userAddress, bridgeReserveTokenUTXO, userClaimNFTUTXO, fundTransactionUTXO) => {

  console.log(bridgeReserveTokenUTXO, userClaimNFTUTXO, fundTransactionUTXO)

  console.log('contract.tokenAddress', contract.tokenAddress)

  const { amount } = reverseClaimCommitment(userClaimNFTUTXO.token_data.nft.commitment)
  const amountToClaim = amount

  console.log('bridgeReserveTokenUTXO.token_data.amount', bridgeReserveTokenUTXO.token_data.amount)

  console.log('amountToClaim', amountToClaim)

  const amountBackToReserve = BigInt(bridgeReserveTokenUTXO.token_data.amount) - amountToClaim

  console.log('amountBackToReserve', amountBackToReserve)

  const totalChangeAmount = BigInt(fundTransactionUTXO.value) - BigInt(800) - BigInt(550)

  const bridgeUTXO: Utxo = {
    txid: bridgeReserveTokenUTXO.tx_hash,
    vout: bridgeReserveTokenUTXO.tx_pos,
    satoshis: BigInt(bridgeReserveTokenUTXO.value),
    token: {
      amount: BigInt(bridgeReserveTokenUTXO.token_data.amount),
      category: bridgeReserveTokenUTXO.token_data.category
    }
  }

  const claimNFTUTXO: Utxo = {
    txid: userClaimNFTUTXO.tx_hash,
    vout: userClaimNFTUTXO.tx_pos,
    satoshis: BigInt(userClaimNFTUTXO.value),
    token: userClaimNFTUTXO.token_data
  }

  const fundUTXO: Utxo = {
    txid: fundTransactionUTXO.tx_hash,
    vout: fundTransactionUTXO.tx_pos,
    satoshis: BigInt(fundTransactionUTXO.value),
  }

  const transaction = await contract.functions.claim()
  .from([bridgeUTXO])
  // .fromP2PKH(userClaimNFTUTXO, new SignatureTemplate(userWallet.privateKeyWif, HashType.SIGHASH_ALL | HashType.SIGHASH_UTXOS))
  // .fromP2PKH(fundTransactionUTXO, new SignatureTemplate(userWallet.privateKeyWif, HashType.SIGHASH_ALL | HashType.SIGHASH_UTXOS))
  .fromP2PKH(claimNFTUTXO, new SignatureTemplate(Uint8Array.from(Array(32))))
  .fromP2PKH(fundUTXO, new SignatureTemplate(Uint8Array.from(Array(32))))
  .to([
    {
      to: contract.tokenAddress,
      amount: BigInt(Number(bridgeReserveTokenUTXO.value)),
      token: {
        amount: amountBackToReserve,
        category: bridgeReserveTokenUTXO.token_data.category
      }
    },
    {
      to: toTokenAddress(userAddress),
      amount: BigInt(Number(800)),
      token: {
        amount: BigInt(Number(amountToClaim)),
        category: bridgeReserveTokenUTXO.token_data.category
      }
    },
    {
      to: userAddress,
      amount: totalChangeAmount,
    }
  ])
  .withoutTokenChange()
  .withAge(0)

  console.log(transaction)


  const rawTransactionHex = await transaction.build();
  console.log('rawTransactionHex', rawTransactionHex)
  const decodedTransaction: any = decodeTransaction(hexToBin(rawTransactionHex));
  if (typeof decodedTransaction === "string") {
    alert("Failed to decode transaction");
  }

  console.log(decodedTransaction)


  decodedTransaction.inputs[1].unlockingBytecode = Uint8Array.from([]);
  decodedTransaction.inputs[2].unlockingBytecode = Uint8Array.from([]);

  // construct new transaction object for SourceOutputs, for stringify & not to mutate current network provider 
  const listSourceOutputs = [{
    ...decodedTransaction.inputs[0],
    // @ts-ignore
    lockingBytecode: (cashAddressToLockingBytecode(contract.tokenAddress)).bytecode,
    valueSatoshis: BigInt(bridgeUTXO.satoshis),
    token: bridgeUTXO.token && {
      ...bridgeUTXO.token,
      category: hexToBin(bridgeUTXO.token.category),
    },
    contract: {
      abiFunction: transaction.abiFunction,
      redeemScript: contract.redeemScript,
      artifact: contract.artifact,
    }
  }, {
    ...decodedTransaction.inputs[1],
    // @ts-ignore
    lockingBytecode: (cashAddressToLockingBytecode(userAddress)).bytecode,
    valueSatoshis: BigInt(userClaimNFTUTXO.value),
  }, {
    ...decodedTransaction.inputs[2],
    // @ts-ignore
    lockingBytecode: (cashAddressToLockingBytecode(userAddress)).bytecode,
    valueSatoshis: BigInt(fundTransactionUTXO.value),
  }];

  const wcTransactionObj = {
    transaction: decodedTransaction,
    sourceOutputs: listSourceOutputs,
    broadcast: true,
    userPrompt: "Claim Token"
  };

  console.log(wcTransactionObj)

  return wcTransactionObj;
}